$(document).ready(() => {
  $.get('/api/posts', (posts) => {
    userPosts(posts, $('.postsContainter'));
  });
});
