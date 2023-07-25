$(document).ready(() => {
  $.get(`/api/posts/${postId}`, (posts) => {
    userPostsWithReplies(posts, $('.postsContainter'));
  });
});
