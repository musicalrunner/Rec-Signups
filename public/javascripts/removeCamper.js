$('document').ready( function() {

  var $camper = $('#camperID');
  var $cabin = $('#cabinID');
  var $submit = $('#submit');
  console.log($('#campersByCabin').html());
  var campersByCabin = JSON.parse($('#campersByCabin').html());


  $cabin.change(function() {
    $camper.empty();
    campersByCabin[$cabin.val().replace(' ', '-')].forEach(function(element, index) {
      $camper.append('<option value="' + element + '">' + element + '</option>');
    });
  });

  $submit.click(function() {
    var alertString = 'Click OK to actually remove the following camper from camp. Forever.\n\n';
    alertString += $camper.val() + ' from ' + $cabin.val();

    var remove = confirm(alertString);
    console.log(remove);
    if(remove) {
      $('#removeCamperForm').submit();
    }

  });


});
