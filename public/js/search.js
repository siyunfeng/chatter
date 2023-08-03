let timer;

$('#searchBox').keydown((event) => {
  clearTimeout(timer);
  let textbox = $(event.target);
  let value = textbox.val();
  let searchType = textbox.data().search;

  timer = setTimeout(() => {
    value = textbox.val().trim();

    if (value === '') {
      $('.resultsContainer').html('');
    } else {
      console.log('value =', value, 'searchType =', searchType);
    }
  }, 1000);
});
