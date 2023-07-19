$(document).ready(() => {
  $.get('/api/posts', (posts) => {
    userPosts(posts, $('.postsContainter'));
  });
});

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
