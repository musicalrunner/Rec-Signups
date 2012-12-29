$('document').ready(function() {

  $('.button').each(function(index, element) {
    $element = $(element);
    $element.wrap('<a href="/' + $element.attr('id') + '" />');
  });

  /*
  $('#addCamper').wrap('<a href="/setup/addCamper" />');
  $('#addRec').wrap('<a href="/setup/addRec" />');
  */

});
