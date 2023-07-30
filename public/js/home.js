$(document).ready(() => {
  $.get('/api/posts', { followingOnly: true }, (posts) => {
    userPosts(posts, $('.postsContainter'));
  });
});
