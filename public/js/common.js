// Global Variables
let cropper;

// New post/reply editing & submit button interaction
$('#postTextarea, #replyTextarea').keyup((event) => {
  const textbox = $(event.target);
  const textboxValue = textbox.val().trim();

  const isModal = textbox.parents('.modal').length === 1;
  const submitButton = isModal
    ? $('#submitReplyButton')
    : $('#submitPostButton');
  if (!submitButton.length) {
    return alert('No submit button found.');
  }
  if (!textboxValue) {
    submitButton.prop('disabled', true);
  } else {
    submitButton.prop('disabled', false);
  }
});

// Create new post/reply
$('#submitPostButton, #submitReplyButton').click((event) => {
  const button = $(event.target);
  const isModal = button.parents('.modal').length === 1;
  const textbox = isModal ? $('#replyTextarea') : $('#postTextarea');

  const data = {
    content: textbox.val().trim(),
  };

  if (isModal) {
    const id = button.data().id;
    if (!id) {
      return alert('Reply button id is null.');
    }
    data.replyTo = id;
  }

  $.post('/api/posts', data, (postData) => {
    if (postData.replyTo) {
      location.reload();
    } else {
      const html = createPostHtml(postData);
      $('.postsContainter').prepend(html);
      textbox.val('');
      button.prop('disabled', true);
    }
  });
});

// Click on reply/comment button
$('#replyModal').on('show.bs.modal', (event) => {
  const button = $(event.relatedTarget);
  const postId = getPostIdFromElement(button);
  $('#submitReplyButton').data('id', postId);

  $.get(`/api/posts/${postId}`, (post) => {
    userPosts(post.postData, $('#originalPostContainer'));
  });
});

// remove previous original post in reply modal when close the modal
$('#replyModal').on('hidden.bs.modal', () => {
  $('#originalPostContainer').html('');
});

// Update post id to the delete post button
$('#deletePostModal').on('show.bs.modal', (event) => {
  const button = $(event.relatedTarget);
  const postId = getPostIdFromElement(button);
  $('#deletePostButton').data('id', postId);
});

// Update post id to the pin post button
$('#pinPostModal').on('show.bs.modal', (event) => {
  const button = $(event.relatedTarget);
  const postId = getPostIdFromElement(button);
  $('#pinPostButton').data('id', postId);
});

// Update post id to the unpin post button
$('#unpinPostModal').on('show.bs.modal', (event) => {
  const button = $(event.relatedTarget);
  const postId = getPostIdFromElement(button);
  $('#unpinPostButton').data('id', postId);
});

// Send DELETE request to posts API route to delete specific post
$('#deletePostButton').click((event) => {
  const id = $(event.target).data('id');

  $.ajax({
    url: `/api/posts/${id}`,
    type: 'DELETE',
    success: (data, status, xhr) => {
      if (xhr.status !== 202) {
        alert('Failed to delete the post.');
        return;
      }
      location.reload();
    },
  });
});

// Send PUT request to posts API route to modify pinned status of specific post
$('#pinPostButton').click((event) => {
  const id = $(event.target).data('id');

  $.ajax({
    url: `/api/posts/${id}`,
    type: 'PUT',
    data: { pinned: true },
    success: (data, status, xhr) => {
      if (xhr.status !== 204) {
        alert('Failed to pin the post.');
        return;
      }
      location.reload();
    },
  });
});

// Send PUT request to posts API route to modify pinned post to unpinned post
$('#unpinPostButton').click((event) => {
  const id = $(event.target).data('id');

  $.ajax({
    url: `/api/posts/${id}`,
    type: 'PUT',
    data: { pinned: false },
    success: (data, status, xhr) => {
      if (xhr.status !== 204) {
        alert('Failed to pin the post.');
        return;
      }
      location.reload();
    },
  });
});

// Modal for uploading profile image
$('#fileImage').change((event) => {
  const input = $(event.target)[0];

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (event) => {
      let image = document.getElementById('imagePreview');
      image.src = event.target.result;

      if (cropper !== undefined) {
        cropper.destroy();
      }
      // need to write in JavaScript not jQuery
      cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        background: false,
      });
    };
    reader.readAsDataURL(input.files[0]);
  }
});

// Modal for uploading cover image
$('#coverImage').change((event) => {
  const input = $(event.target)[0];

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (event) => {
      let image = document.getElementById('coverPreview');
      image.src = event.target.result;

      if (cropper !== undefined) {
        cropper.destroy();
      }

      cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        background: false,
      });
    };
    reader.readAsDataURL(input.files[0]);
  }
});

// Submit profile image uploading
$('#imageUploadButton').click(() => {
  let canvas = cropper.getCroppedCanvas();

  if (!canvas) {
    alert('Could not upload this file. Please make sure it is an image file.');
    return;
  }
  // blob stands for Binary Large Object, used for storing images and videos
  canvas.toBlob((blob) => {
    let formData = new FormData();
    formData.append('croppedImage', blob); // key-value pair for formData object, same as formData.croppedImage = blob

    $.ajax({
      url: '/api/users/profileImage',
      type: 'POST',
      data: formData,
      // prevent formData from converting it to a string
      processData: false,
      // used for forms submitting files, it forces jQuery NOT to add a content type header with this request
      contentType: false,
      success: () => {
        location.reload();
      },
    });
  });
});

// Submit cover image uploading
$('#coverImageUploadButton').click(() => {
  let canvas = cropper.getCroppedCanvas();

  if (!canvas) {
    alert('Could not upload this file. Please make sure it is an image file.');
    return;
  }

  canvas.toBlob((blob) => {
    let formData = new FormData();
    formData.append('croppedImage', blob);

    $.ajax({
      url: '/api/users/coverImage',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: () => {
        location.reload();
      },
    });
  });
});

// Click on like button
$(document).on('click', '.likeButton', (event) => {
  const button = $(event.target);
  const postId = getPostIdFromElement(button);

  if (postId === undefined) return;
  /*  send PUT request to posts api, it will return a value from the api as its parameter in the success callback function */
  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: 'PUT',
    success: (postData) => {
      button.find('span').text(postData.likes.length || '');
      // access loggedInUser from main-layout.pug script
      if (postData.likes.includes(loggedInUser._id)) {
        button.addClass('active');
      } else {
        button.removeClass('active');
      }
    },
  });
});

// Click on repost button
$(document).on('click', '.repostButton', (event) => {
  const button = $(event.target);
  const postId = getPostIdFromElement(button);

  if (postId === undefined) return;

  $.post(`/api/posts/${postId}/repost`, (postData) => {
    button.find('span').text(postData.repostedBy.length || '');

    if (postData.repostedBy.includes(loggedInUser._id)) {
      button.addClass('active');
    } else {
      button.removeClass('active');
    }
  });
});

// Click on specific post to get to its details page
$(document).on('click', '.post', (event) => {
  const eachPost = $(event.target);
  const postId = getPostIdFromElement(eachPost);

  if (postId && !eachPost.is('button')) {
    window.location.href = `/post/${postId}`;
  }
});

// Click on follow button to follow a specific user
$(document).on('click', '.followButton', (event) => {
  const button = $(event.target);
  const userId = button.data().user;

  $.ajax({
    url: `/api/users/${userId}/follow`,
    type: 'PUT',
    success: (loggedInUser, status, xhr) => {
      if (xhr.status === 404) {
        return alert('User not found at this moment, please try again later.');
      }

      let ifFollow = 1;
      if (loggedInUser.followings?.includes(userId)) {
        button.addClass('following');
        button.text('Following');
      } else {
        button.removeClass('following');
        button.text('Follow');
        ifFollow = -1;
      }

      const followersLabel = $('#followersValue');
      if (followersLabel.length !== 0) {
        let followersText = followersLabel.text();
        followersLabel.text(parseInt(followersText) + ifFollow);
      }
    },
  });
});

// Get post id from elements function
const getPostIdFromElement = (element) => {
  const isRoot = element.hasClass('post');
  const rootElement = isRoot ? element : element.closest('.post');
  const postId = rootElement.data().id;

  if (postId) {
    return postId;
  } else {
    return alert('Post id is undefined.');
  }
};

// Generate posts content
const createPostHtml = (postData, largeFont = false) => {
  if (!postData) {
    return alert('postData is null');
  }

  const isRepost = postData.repostData !== undefined;
  const repostUsername = isRepost ? postData.postedBy.username : null;
  postData = isRepost ? postData.repostData : postData;

  const {
    content,
    postedBy,
    createdAt,
    likes,
    repostedBy,
    repostData,
    replyTo,
  } = postData;
  const { firstName, lastName, username, profileImage } = postedBy;

  if (postData._id === undefined) {
    console.log('User object not populated.');
  }

  const timeStamp = timeAgo(new Date(createdAt));

  const likeButtonActive = likes.includes(loggedInUser._id) ? 'active' : '';
  const repostButtonActive = repostedBy.includes(loggedInUser._id)
    ? 'active'
    : '';

  const largeFontClass = largeFont ? 'largeFont' : '';

  const repostPost = `<span><i class='fas fa-retweet'></i> Reposted by <a href='/profile/${repostUsername}'>@${repostUsername}</a></span>`;
  const repostText = isRepost ? repostPost : '';

  let replyFlag = '';
  if (replyTo && replyTo._id) {
    if (!replyTo.postedBy._id) {
      return alert('Posted by to is not populated');
    }

    const { username } = replyTo.postedBy;
    replyFlag = `<div class='replyFlag'>
                    Replying to <a href='/profile/${username}'>@${username}</a>
                </div>`;
  }

  let buttons = '';
  let pinnedPostText = '';
  if (postedBy._id === loggedInUser._id) {
    let pinnedClass = '';
    let dataTarget = '#pinPostModal';
    if (postData.pinned === true) {
      pinnedClass = 'pinned';
      dataTarget = '#unpinPostModal';
      pinnedPostText = `<i class='fas fa-thumbtack'></i><span> Pinned post</span>`;
    }

    buttons = `<button class='pinButton ${pinnedClass}' data-id='${postData._id}' data-bs-toggle='modal' data-bs-target='${dataTarget}'>
                <i class='fas fa-thumbtack'></i>
              </button>
              <button data-id='${postData._id}' data-bs-toggle='modal' data-bs-target='#deletePostModal'>
                <i class='far fa-trash-can'></i>
              </button>`;
  }

  return `<div class='post ${largeFontClass}' data-id=${postData._id}>
            <div class='postActionContainer'>
              ${repostText}
            </div>
            <div class='mainContentContainer'>
                <div class='userImageContainer'>
                    <img src=${profileImage} />
                </div>
                <div class='postContentContainer'>
                  <div class='pinnedPostText'>${pinnedPostText}</div>
                <div class='postHeader'>
                  <a href='/profile/${username}' class='displayName'>
                            ${firstName} ${lastName}
                        </a>
                        <span class='username'>@${username}</span>
                        <span class='postDate'>${timeStamp}</span>
                        ${buttons}
                    </div>
                    ${replyFlag}
                    <div class='postBody'>
                        <span></span>${content}
                    </div>
                    <div class='postFooter'>
                        <div class='postButtonContainer red'>
                            <button class='likeButton ${likeButtonActive}'>
                                <i class='far fa-heart'></i>
                                <span>${postData.likes.length || ''}</span>
                            </button>
                        </div>
                        <div class='postButtonContainer'>
                            <button data-bs-toggle='modal' data-bs-target='#replyModal'>
                                <i class='far fa-message'></i>
                            </button>
                        </div>
                        <div class='postButtonContainer green'>
                            <button class='repostButton ${repostButtonActive}'>
                                <i class='fas fa-retweet'></i>
                                <span>${postData.repostedBy.length || ''}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>`;
};

// Time interval conversion
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  const [secPerMinute, secPerHour, secPerDay, secPerMonth, secPerYear] = [
    60, 3600, 86400, 2592000, 31536000,
  ];

  let interval = Math.floor(seconds / secPerYear);
  if (interval >= 1) {
    return interval + ' years ago';
  }

  interval = Math.floor(seconds / secPerMonth);
  if (interval >= 1) {
    return interval + ' months ago';
  }

  interval = Math.floor(seconds / secPerDay);
  if (interval >= 1) {
    return interval + ' days ago';
  }

  interval = Math.floor(seconds / secPerHour);
  if (interval >= 1) {
    return interval + ' hours ago';
  }

  interval = Math.floor(seconds / secPerMinute);
  if (interval >= 1) {
    return interval + ' minutes ago';
  }

  if (seconds < 10) return 'just now';

  return Math.floor(seconds) + ' seconds ago';
};

// Invoke generate posts content within specific container
const userPosts = (posts, container) => {
  container.html('');

  if (!Array.isArray(posts)) {
    posts = [posts];
  }

  posts.forEach((post) => {
    const html = createPostHtml(post);
    container.append(html);
  });

  if (!posts.length) {
    container.append(
      `<span class='noPosts'>This user have not posted yet. </span>`
    );
  }
};

// Invoke generate pinned post content within specific container
const userPinnedPost = (posts, container) => {
  if (posts.length === 0) {
    container.hide();
    return;
  }

  container.html('');

  posts.forEach((post) => {
    const html = createPostHtml(post);
    container.append(html);
  });
};

// Genertae posts details with replies
const userPostsWithReplies = (posts, container) => {
  container.html('');

  if (posts.replyTo && posts.replyTo._id) {
    let html = createPostHtml(posts.replyTo);
    container.append(html);
  }

  let mainPostHtml = createPostHtml(posts.postData, true);
  container.append(mainPostHtml);

  posts.replies.forEach((post) => {
    let html = createPostHtml(post);
    container.append(html);
  });
};

//
const getUsers = (users, container) => {
  container.html('');

  users.forEach((user) => {
    const html = createUserListHtml(user, true);
    container.append(html);
  });

  if (!users.length) {
    container.append(`<span class='noResults'>No result found. </span>`);
  }
};

const createUserListHtml = (userData, showFollowButton) => {
  const { firstName, lastName, username, profileImage } = userData;

  let isFollowing = loggedInUser.followings?.includes(userData._id);

  let buttonText = isFollowing ? 'Following' : 'Follow';
  let buttonClass = isFollowing ? 'followButton following' : 'followButton';
  let followButton = '';
  if (showFollowButton && loggedInUser._id !== userData._id) {
    followButton = `<div class='followButtonContainer'>
                        <button class='${buttonClass}' data-user='${userData._id}'>${buttonText}</button>
                    </div>`;
  }

  return `<div class='user'>
            <div class='userImageContainer'>
                <img src='${profileImage}' />
            </div>
            <div class='userDetailsContainer'>
                <div class='header'>
                    <a href='/profile/${username}'>
                        ${firstName} ${lastName}
                    </a>
                    <span class='username'>@${username}</span>
                </div>
            </div>
            ${followButton}
        </div>`;
};
