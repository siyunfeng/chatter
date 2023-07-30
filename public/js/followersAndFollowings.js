$(document).ready(() => {
  if (selectedTab === 'followers') {
    loadFollowers();
  } else {
    loadFollowing();
  }
});

const loadFollowers = () => {
  $.get(`/api/users/${profileUserId}/followers`, (userNetwork) => {
    getUsersNetwork(userNetwork.followers, $('.networkResultsContainer'));
  });
};

const loadFollowing = () => {
  $.get(`/api/users/${profileUserId}/following`, (userNetwork) => {
    getUsersNetwork(userNetwork.followings, $('.networkResultsContainer'));
  });
};

const getUsersNetwork = (userNetwork, container) => {
  container.html('');

  userNetwork.forEach((network) => {
    const html = createNetworkHtml(network, true);
    container.append(html);
  });

  if (!userNetwork.length) {
    container.append(`<span class='noResults'>No result found. </span>`);
  }
};

const createNetworkHtml = (userData, showFollowButton) => {
  const { firstName, lastName, username, profileImg } = userData;

  let isFollowing = loggedInUser.followings?.includes(userData._id);

  let buttonText = isFollowing ? 'Following' : 'Follow';
  let buttonClass = isFollowing ? 'followButton following' : 'followButton';
  let followButton = '';
  if (showFollowButton && loggedInUser._id !== userData._id) {
    followButton = `<div class='followButtonContainer'>
                        <button class='${buttonClass}' data-user='${userData._id}'>${buttonText}</button>
                    </div>`;
  }

  return `<div class='user'>
            <div class='userImageContainer'>
                <img src='${profileImg}' />
            </div>
            <div class='userDetailsContainer'>
                <div class='header'>
                    <a href='/profile/${username}'>
                        ${firstName} ${lastName}
                    </a>
                    <span class='username'>@${username}</span>
                </div>
            </div>
            ${followButton}
        </div>`;
};
