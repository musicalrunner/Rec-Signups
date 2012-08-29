$('document').ready(function() {

  $('#submit').click(function() {
    $('#addCamperForm').attr('action', '/setup/addingCamper');
    $('#addCamperForm').attr('method', 'POST');
    $('#addCamperForm').submit();
  });
});
