$('document').ready(function() {

  $('.link').each(function(index, element) {
    $element = $(element);
    $element.wrap('<a href="/setup/' + $element.attr('id') + '" />');
    console.log('wrapped <a href="/setup/' + $element.attr('id') + '" />');
  });

  /*
  $('#addCamper').wrap('<a href="/setup/addCamper" />');
  $('#addRec').wrap('<a href="/setup/addRec" />');
  */

});
