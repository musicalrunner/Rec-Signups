$('document').ready(function() {
  var weekNum = -1;
  if (localStorage.getItem('weekNum')) {
    weekNum = localStorage.getItem('weekNum');
    $('#weekID').attr('value', weekNum);
  }

  $('.link').each(function(index, element) {
    $element = $(element);
    $element.wrap('<a href="/' + $element.attr('id') + '?week=' + weekNum + '" />');
  });
 
  $('#setWeek').click(function() {
    $clicked = $(this);
    weekNum = $('select#weekID').val();
    // save locally to get a default for index page
    localStorage.setItem('weekNum',weekNum);

/*
    // Send to server for use in assigning things
    console.log('weekNum = ' + weekNum);
    console.log('this.id() = ' + $clicked.attr('id'));
    $('#weekForm').attr('action', $clicked.attr('id'));
    $('#weekForm').submit();
    */
  });


});
