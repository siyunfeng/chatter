$(document).ready(() => {
  if (selectedTab === 'replies') {
    loadReplies();
  } else {
    loadPosts();
  }
});

const loadPosts = () => {
  $.get('/api/posts', { postedBy: profileUserId, isReply: false }, (posts) => {
    userPosts(posts, $('.postsContainter'));
  });
};

const loadReplies = () => {
  $.get('/api/posts', { postedBy: profileUserId, isReply: true }, (posts) => {
    userPosts(posts, $('.postsContainter'));
  });
};
