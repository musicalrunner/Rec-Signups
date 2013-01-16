$('document').ready( function() {

  var $camper = $('#camperID');
  var $cabin = $('#cabinID');
  console.log($('#campersByCabin').html());
  var campersByCabin = JSON.parse($('#campersByCabin').html());


  $cabin.change(function() {
    $camper.empty();
    campersByCabin[$cabin.val().replace(' ', '-')].forEach(function(element, index) {
      $camper.append('<option value="' + element + '">' + element + '</option>');
    });
  });

});
