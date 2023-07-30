$(document).ready(() => {
  if (selectedTab === 'followers') {
    loadFollowers();
  } else {
    loadFollowing();
  }
});

const loadFollowers = () => {
  $.get(`/api/users/${profileUserId}/followers`, (posts) => {
    getUsersNetwork(posts, $('.networkResultsContainer'));
  });
};

const loadFollowing = () => {
  $.get(`/api/users/${profileUserId}/following`, (posts) => {
    getUsersNetwork(posts, $('.networkResultsContainer'));
  });
};

const getUsersNetwork = (data, container) => {
  console.log('data in getUserNetwork', data);
};
