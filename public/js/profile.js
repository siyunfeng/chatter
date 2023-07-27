$(document).ready(() => {
  loadPosts();
});

const loadPosts = () => {
  $.get('/api/posts', { postedBy: profileUserId }, (posts) => {
    userPosts(posts, $('.postsContainter'));
  });
};
