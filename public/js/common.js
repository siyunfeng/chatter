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
  const { firstName, lastName, username, profileImg } = postedBy;
  return `<div class='post'>
            <div class='mainContentContainer'>
                 <div class='userImageContainer'>
                    <img src=${profileImg} />
                </div>
                <div class='postContentContainer'>
                    <div class='postHeader'>
                        <a href='/profile/${username}'>${firstName} ${lastName}</a>
                        <span class='username'>@${username}</span>
                        <span class='postDate'>${createdAt}</span>
                    </div>
                    <div class='postBody'>
                        <span></span>${content}
                    </div>
                    <div class='postFooter'>
                    </div>
                </div>
            </div>
        </div>`;
};
