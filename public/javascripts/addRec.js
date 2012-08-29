$('document').ready(function() {

  $('#submit').click(function() {
    $('#addRecForm').attr('action', '/setup/addingRec');
    $('#addRecForm').attr('method', 'POST');
    $('#addRecForm').submit();
  });
});
