$('#postTextarea').keyup((event) => {
  const textbox = $(event.target).val();
  const textboxValue = textbox.trim();
  const submitButton = $('#submitPostButton');
  if (!submitButton.length) {
    return alert('No submit button found.');
  }
  if (!textboxValue) {
    submitButton.prop('disabled', true);
  } else {
    submitButton.prop('disabled', false);
  }
});

$('#submitPostButton').click((event) => {
  const button = $(event.target);
  const textbox = $('#postTextarea');
  const data = {
    content: textbox.val().trim(),
  };

  $.post('/api/posts', data, (postData) => {
    const html = createPostHtml(postData);
    $('.postsContainter').prepend(html);
    textbox.val('');
    button.prop('disabled', true);
  });
});

const createPostHtml = (postData) => {
  const { content, postedBy, createdAt } = postData;
  const { firstName, lastName, username, profileImg, _id } = postedBy;
  const timeStamp = timeAgo(new Date(createdAt));

  if (_id === undefined) {
    console.log('User object not populated.');
  }
  return `<div class='post'>
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
                    <div class='postBody'>
                        <span></span>${content}
                    </div>
                    <div class='postFooter'>
                        <div class='postButtonContainer'>
                            <button>
                                <i class='far fa-heart'></i>
                            </button>
                        </div>
                        <div class='postButtonContainer'>
                            <button>
                                <i class='far fa-message'></i>
                            </button>
                        </div>
                        <div class='postButtonContainer'>
                            <button>
                                <i class='fas fa-retweet'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
};

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
