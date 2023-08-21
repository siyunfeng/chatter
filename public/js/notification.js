$(document).ready(() => {
  $.get('/api/notifications', (data) => {
    outputNotificationList(data, $('.resultsContainer'));
  });
});

const outputNotificationList = (notifications, container) => {
  notifications.forEach((notification) => {
    let html = createNotificationHtml(notification);
    container.append(html);
  });

  if (!notifications.length) {
    container.append(`<span class='noResults'>No new notifications</span>`);
  }
};

const createNotificationHtml = (notification) => {
  const { fromUser } = notification;
  const text = getNotificationText(notification);
  const redirectURL = getNotificationURL(notification);
  return `<a href=${redirectURL} class='resultListItem notification'>
            <div class='resultsImageContainer'>
                <img src=${fromUser.profileImage} />
            </div>
            <div class='resultsDetailsContainer ellipsis'>
                <span class='ellipsis'>${text}</span>
            </div>
          </a>`;
};

const getNotificationText = (notification) => {
  const { fromUser, notificationType } = notification;

  if (!fromUser.firstName || !fromUser.lastName) {
    return alert('Not able to load this notification from which user');
  }

  const fromUserName = `${fromUser.firstName} ${fromUser.lastName}`;
  let text;

  switch (notificationType) {
    case 'repost':
      text = `${fromUserName} reposted one of your posts`;
      break;
    case 'postLike':
      text = `${fromUserName} liked one of your posts`;
      break;
    case 'reply':
      text = `${fromUserName} replied to one of your posts`;
      break;
    case 'follow':
      text = `${fromUserName} followed you`;
      break;
  }

  return `<span class='ellipsis'>${text}</span>`;
};

const getNotificationURL = (notification) => {
  const { fromUser, notificationType, entityId } = notification;
  let url = '/';

  if (
    notificationType === 'repost' ||
    notificationType === 'postLike' ||
    notificationType === 'reply'
  ) {
    return (url = `/post/${entityId}`);
  } else if (notificationType === 'follow') {
    return (url = `/profile/${fromUser.username}`);
  }
};
