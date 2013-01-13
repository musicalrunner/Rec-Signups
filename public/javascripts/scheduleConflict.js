$('document').ready( function() {


  // If the reject button is clicked, go back to assignments
  $('#abort, #ok').wrap('<a href="/assign?week=' + localStorage.getItem('weekNum') + '" />');


  // Click handler for "force add"
  var overwrite = function() {

    $form = $('#assignment');
    // Fix the rec name by replacing spaces with hyphens
    var recName = $('input[name="rec"]').val();
    $('input[name="rec"]').val(recName.replace(' ', '-'));

    $form.submit();

  };

  // If the add button is clicked, submit the assignment
  $('#overwrite').click(overwrite);

});
