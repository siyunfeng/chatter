$(document).ready(() => {
  if (selectedTab === 'followers') {
    loadFollowers();
  } else {
    loadFollowing();
  }
});

const loadFollowers = () => {
  $.get(`/api/users/${profileUserId}/followers`, (userNetwork) => {
    getUsers(userNetwork.followers, $('.resultsContainer'));
  });
};

const loadFollowing = () => {
  $.get(`/api/users/${profileUserId}/following`, (userNetwork) => {
    getUsers(userNetwork.followings, $('.resultsContainer'));
  });
};
