$('document').ready(function() {

/*
  $('#setup').wrap('<a href="/setup" />');
  $('#assign').wrap('<a href="/assign" />');
  $('#attendance').wrap('<a href="/attendance" />');
  $('#cabinList').wrap('<a href="/cabinList" />');
  $('#reset').wrap('<a href="/reset" />');
  */

  $('.button').each(function(index, element) {
    $element = $(element);
    $element.wrap('<a href="/' + $element.attr('id') + '" />');
  });

  $('.button').click(function() {
    clicked = $(this);
    var weekNum = $('select#weekID').val();
    localStorage.setItem('weekNum',weekNum);
    alert('set local storage');
    /*
    console.log('weekNum = ' + weekNum);
    console.log('this.id() = ' + clicked.attr('id'));
    $('#weekForm').attr('action', clicked.attr('id')) // finish this!
    $('#weekForm').submit();
    */
  });


});
