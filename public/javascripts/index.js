$('document').ready(function() {

/*
  $('#setup').wrap('<a href="/setup" />');
  $('#assign').wrap('<a href="/assign" />');
  $('#attendance').wrap('<a href="/attendance" />');
  $('#cabinList').wrap('<a href="/cabinList" />');
  $('#reset').wrap('<a href="/reset" />');
  */


  $('.button').click(function() {
    clicked = $(this);
    var weekNum = $('select#weekID').val();
    console.log('weekNum = ' + weekNum);
    console.log('this.id() = ' + clicked.attr('id'));
    $('#weekForm').attr('action', clicked.attr('id')) // finish this!
    $('#weekForm').submit();
  });


});
