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
