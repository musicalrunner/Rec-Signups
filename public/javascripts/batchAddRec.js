$('document').ready( function() {

  // Ensure only the first/second or double chekbox is checked
  $('#check_double').click(function() {
    console.log('double rec box clicked');
    if($(this).prop('checked')) {
      console.log('double rec box is now checked');
      ['#check_first','#check_second'].forEach(function(name, index) {
        if($(name).prop('checked')) {
          console.log(name + ' was checked');
          $(name).prop('checked', false);
        }
      });
    }
  });

  $('#check_first,#check_second').click(function() {
    if($(this).prop('checked')) {
      $('#check_double').prop('checked', false);
    }
  });

  // Ensure only 1-4 or all boxes are checked
  $('#week_all').click(function(){
    if($(this).prop('checked')) {
      $(':checkbox[name*="week"]:not(#week_all)').each(function(index, name) {
        if($(name).prop('checked')) {
          $(name).prop('checked', false);
        }
      });
    }
  });

  $(':checkbox[name*="week"]:not(#week_all)').click(function() {
    if($(this).prop('checked')) {
      $('#week_all').prop('checked', false);
    }
  });

  $('#submit').click(function() {
    $('#addRecForm').submit();
  });



});
