$('#postTextarea').keyup((event) => {
  const textbox = $(event.target).val();
  const textboxValue = textbox.trim();
  const submitButton = $('#submitPostButton');
  if (!submitButton.length) {
    return alert('No submit button found.');
  }
  if (!textboxValue) {
    submitButton.prop('disabled', true);
  } else {
    submitButton.prop('disabled', false);
  }
});
