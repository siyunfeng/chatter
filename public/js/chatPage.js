$(document).ready(() => {
  $.get(`/api/chats/${chatId}`, (data) => {
    $('#chatName').text(getChatName(data));
  });

  $.get(`/api/chats/${chatId}/messages`, (data) => {
    let messages = [];

    data.forEach((message) => {
      let html = createMessageHtml(message);
      messages.push(html);
    });

    let messagesHtml = messages.join('');

    addMessagesHtmlToPage(messagesHtml);
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

// event listener for if user press enter key to send message
$('.messageInputTextBox').keydown((event) => {
  if (event.which === 13) {
    submitMessage();
    return false;
  }
});

// event listener for if user click on send button to send message
$('.sendMessageButton').click(() => {
  submitMessage();
});

const submitMessage = () => {
  let content = $('.messageInputTextBox').val().trim();
  if (content) {
    sendMessage(content);
    $('.messageInputTextBox').val('');
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
  });
};

const addChatMessageHtml = (message) => {
  if (!message || !message._id) {
    alert('Message is not valid');
    return;
  }

  let messageDiv = createMessageHtml(message);

  addMessagesHtmlToPage(messageDiv);
};

const addMessagesHtmlToPage = (html) => {
  $('.chatMessages').append(html);
};

const createMessageHtml = (message) => {
  let isMine = message.sender._id === loggedInUser._id;
  let liClassName = isMine ? 'msgFromMine' : 'msgFromOthers';
  return `<li class='message ${liClassName}'>
      <div class='messageContainer'>
        <p class='messageBody'>${message.content}</p>
      </div>
    </li>`;
};
