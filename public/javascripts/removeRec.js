$('document').ready( function() {

  var $rec = $('#recID');
  var $recBlock = $('#recBlockID');
  var $submit = $('#submit');
  console.log($('#recsByRecBlock').html());
  var campersByCabin = JSON.parse($('#recsByRecBlock').html());


  $recBlock.change(function() {
    $rec.empty();
    recsByRecBlock[$recBlock.val().replace(' ', '-')].forEach(function(element, index) {
      $rec.append('<option value="' + element + '">' + element + '</option>');
    });
  });

  $submit.click(function() {
    var alertString = 'Click OK to actually remove the following rec from camp. Forever.\n\n';
    var week = recsByRecBlock[$recBlock.val().replace(' ', '-')]; // finish this!
    alertString += $rec.val() + ', during ' + $recBlock.val() + ' rec, week ' + ;

    var remove = confirm(alertString);
    console.log(remove);
    if(remove) {
      $('#removeCamperForm').submit();
    }

  });


});
