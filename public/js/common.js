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
    userPosts(post, $('#originalPostContainer'));
  });
});

// remove previous original post in reply modal when close the modal
$('#replyModal').on('hidden.bs.modal', () => {
  $('#originalPostContainer').html('');
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
const createPostHtml = (postData) => {
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
    _id,
    likes,
    repostedBy,
    repostData,
    replyTo,
  } = postData;
  const { firstName, lastName, username, profileImg } = postedBy;

  if (_id === undefined) {
    console.log('User object not populated.');
  }

  const timeStamp = timeAgo(new Date(createdAt));

  const likeButtonActive = likes.includes(loggedInUser._id) ? 'active' : '';
  const repostButtonActive = repostedBy.includes(loggedInUser._id)
    ? 'active'
    : '';

  const repostPost = `<span><i class='fas fa-retweet'></i> Reposted by <a href='/profile/${repostUsername}'>@${repostUsername}</a></span>`;
  const repostText = isRepost ? repostPost : '';

  let replyFlag = '';
  if (replyTo) {
    if (!replyTo._id) {
      return alert('Reply to is not populated');
    } else if (!replyTo.postedBy._id) {
      return alert('Posted by to is not populated');
    }

    const { username } = replyTo.postedBy;
    replyFlag = `<div class='replyFlag'>
                    Replying to <a href='/profile/${username}'>@${username}</a>
                </div>`;
  }

  return `<div class='post' data-id=${_id}>
            <div class='postActionContainer'>
              ${repostText}
            </div>
            <div class='mainContentContainer'>
                 <div class='userImageContainer'>
                    <img src=${profileImg} />
                </div>
                <div class='postContentContainer'>
                    <div class='postHeader'>
                        <a href='/profile/${username}' class='displayName'>
                            ${firstName} ${lastName}
                        </a>
                        <span class='username'>@${username}</span>
                        <span class='postDate'>${timeStamp}</span>
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
