$(document).ready(() => {
  $.get(`/api/chats/${chatId}`, (data) => {
    $('#chatName').text(getChatName(data));
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

$('.messageInputTextBox').keydown((event) => {
  if (event.which === 13) {
    submitMessage();
    return false;
  }
});

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
    console.log('message: ', data);
  });
};
