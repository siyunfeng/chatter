$(document).ready(() => {
  $.get('/api/chats', (data, status, xhr) => {
    if (xhr.status === 400) {
      alert('Could not get chat list.');
    } else {
      outputChatList(data, $('.resultsContainer'));
    }
  });
});

const outputChatList = (chatList, container) => {
  chatList.forEach((chatData) => {
    let html = createChatHtml(chatData);
    container.append(html);
  });

  if (chatList.length === 0) {
    container.append(`<span class='noResults'>This chat is not found</span>`);
  }
};

const createChatHtml = (chatData) => {
  let chatName = getChatName(chatData);
  let chatImage = getChatImageElements(chatData);
  let latestMessage = getLatestMessage(chatData.latestMessage);

  return `<a href='/messages/${chatData._id}' class='resultListItem'>
            ${chatImage}
            <div class='resultsDetailsContainer ellipsis'>
              <span class='heading ellipsis'>${chatName}</span>
              <span class='subText ellipsis'>${latestMessage}</span>
            </div>
          </a>`;
};

const getChatImageElements = (chatData) => {
  let usersToChatWith = getUsersToChatWith(chatData.users);

  let groupChatClass = '';
  let chatImage = getUserChatImageElement(usersToChatWith[0]);

  if (usersToChatWith.length > 1) {
    groupChatClass = 'groupChatImage';
    chatImage += getUserChatImageElement(usersToChatWith[1]);
  }

  return `<div class='resultsImageContainer ${groupChatClass}'>${chatImage}</div>`;
};

const getUserChatImageElement = (user) => {
  if (!user || !user.profileImage) {
    return alert('User or user profile image not found');
  }

  return `<img src='${user.profileImage}' alt='user profile image' />`;
};

const getLatestMessage = (latestMessage) => {
  if (latestMessage) {
    let sender = latestMessage.sender;
    return `${sender.firstName} ${sender.lastName}: ${latestMessage.content}`;
  }

  return 'New chat';
};
