$(document).ready(() => {
  $.get(`/api/posts/${postId}`, (posts) => {
    userPosts(posts, $('.postsContainter'));
  });
});
