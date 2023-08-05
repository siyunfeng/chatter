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
  let imageUrl = '';
  let latestMessage = 'This is the lastest message.';

  return `<a href='/messages/${chatData._id}' class='resultListItem'>
            <div class='resultsDetailsContainer'>
                <span class='heading'>${chatName}</span>
                <span class='subText'>${latestMessage}</span>

            </div>
          </a>`;
};

const getChatName = (chatData) => {
  let chatName = chatData.chatName;

  if (!chatName) {
    let usersToChatWith = getUsersToChatWith(chatData.users);
    let namesArray = usersToChatWith.map(
      (user) => `${user.firstName} ${user.lastName}`
    );
    chatName = namesArray.join(', ');
  }

  return chatName;
};

const getUsersToChatWith = (users) => {
  if (users.length === 1) return users;

  let usersList = users.filter((user) => user._id !== loggedInUser._id);
  return usersList;
};
