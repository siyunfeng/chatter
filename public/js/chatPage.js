let typing = false;
let lastTypingTime;

$(document).ready(() => {
  socket.emit('join room', chatId);
  socket.on('typing', () => $('.typingDots').show());
  socket.on('stop typing', () => $('.typingDots').hide());

  $.get(`/api/chats/${chatId}`, (data) => {
    $('#chatName').text(getChatName(data));
  });

  $.get(`/api/chats/${chatId}/messages`, (data) => {
    let messages = [];
    let lastSenderId = '';

    data.forEach((message, index) => {
      let html = createMessageHtml(message, data[index + 1], lastSenderId);
      messages.push(html);

      lastSenderId = message.sender._id;
    });

    let messagesHtml = messages.join('');

    addMessagesHtmlToPage(messagesHtml);
    scrollToBottom(false);
    markAllMessagesAsRead();

    $('.loadingSpinnerContainer').remove();
    $('.chatContainer').css('visibility', 'visible');
  });
});

// send PUT request to /api/chats to update chat name
$('#chatNameButton').click(() => {
  let name = $('#chatNameTextbox').val().trim();

  $.ajax({
    url: `/api/chats/${chatId}`,
    type: 'PUT',
    data: { chatName: name },
    success: (data, status, xhr) => {
      if (xhr.status !== 204) {
        alert('Could not update the chat name');
      } else {
        location.reload();
      }
    },
  });
});

const updateTyping = () => {
  if (!connected) return;

  if (!typing) {
    typing = true;
    socket.emit('typing', chatId);
  }

  lastTypingTime = new Date().getTime();

  let timerLength = 2000;

  setTimeout(() => {
    let timeNow = new Date().getTime();
    let timeDiff = timeNow - lastTypingTime;

    if (timeDiff >= timerLength && typing) {
      socket.emit('stop typing', chatId);
      typing = false;
    }
  }, timerLength);
};

// event listener for if user press enter key to send message
$('.messageInputTextBox').keydown((event) => {
  updateTyping();

  if (event.which === 13) {
    submitMessage();
    return false;
  }
});

// event listener for if user click on send button to send message
$('.sendMessageButton').click(() => {
  updateTyping();
  submitMessage();
});

const submitMessage = () => {
  let content = $('.messageInputTextBox').val().trim();
  if (content) {
    sendMessage(content);
    $('.messageInputTextBox').val('');
    socket.emit('stop typing', chatId);
    typing = false;
  }
};

const sendMessage = (content) => {
  $.post(`/api/messages`, { content, chatId }, (data, status, xhr) => {
    if (xhr.status !== 201) {
      alert('Could not send message');
      $('.messageInputTextBox').val(content);
      return;
    }
    addChatMessageHtml(data);

    if (connected) {
      socket.emit('new message', data);
    }
  });
};

const addChatMessageHtml = (message) => {
  if (!message || !message._id) {
    alert('Message is not valid');
    return;
  }

  let messageDiv = createMessageHtml(message, null, '');

  addMessagesHtmlToPage(messageDiv);
  scrollToBottom(true);
};

const addMessagesHtmlToPage = (html) => {
  $('.chatMessages').append(html);
};

const createMessageHtml = (message, nextMessage, lastSenderId) => {
  let { sender } = message;
  let senderName = `${sender.firstName} ${sender.lastName}`;

  let currentSenderId = sender._id;
  let nextSenderId = nextMessage ? nextMessage.sender._id : '';

  let isFirstMessage = lastSenderId !== currentSenderId;
  let isLastMessage = nextSenderId !== currentSenderId;

  let isMine = sender._id === loggedInUser._id;
  let liClassName = isMine ? 'msgFromMine' : 'msgFromOthers';

  let nameElement = '';
  let imageContainer = '';
  let profileImage = '';

  if (isFirstMessage) {
    liClassName += ' first-message';
    if (!isMine) nameElement = `<span class='senderName'>${senderName}</span>`;
  }

  if (isLastMessage) {
    liClassName += ' last-message';
    profileImage = `<img src=${sender.profileImage} />`;
  }

  if (!isMine) {
    imageContainer = `<div class='imageContainer'>${profileImage}</div>`;
  }

  return `<li class='message ${liClassName}'>
            ${imageContainer}
            <div class='messageContainer'>
            ${nameElement}
            <p class='messageBody'>${message.content}</p>
            </div>
          </li>`;
};

const scrollToBottom = (animated) => {
  const container = $('.chatMessages');
  const { scrollHeight } = container[0];

  if (animated) {
    container.animate({ scrollTop: scrollHeight }, 'slow');
  } else {
    container.scrollTop(scrollHeight);
  }
};

const markAllMessagesAsRead = () => {
  $.ajax({
    url: `/api/chats/${chatId}/messages/read`,
    type: 'PUT',
    success: () => updateBadge('messages'),
  });
};
