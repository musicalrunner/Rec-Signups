$('document').ready(function() {

  $('.link').each(function(index, element) {
    var $element = $(element);
    var week = sessionStorage.getItem('weekNum');
    $element.wrap('<a href="/setup/' + $element.attr('id') + '?week=' + week + '" />');
    console.log('wrapped <a href="/setup/' + $element.attr('id') + '?week=' + week + '" />');
  });

  /*
  $('#addCamper').wrap('<a href="/setup/addCamper" />');
  $('#addRec').wrap('<a href="/setup/addRec" />');
  */

});
