$('document').ready(function() {

  // Get Buttons
  var $buttons = $('.button');
  var $recBlockButtons = $('.button.recBlock');
  var $cabinButtons = $('.button.cabin');
  var $allCamperButtons = $('.button.camper');
  var $camperButtons = {};
  var $allRecButtons = $('.button.rec');
  var $recButtons = {};

  for(var i = 0; i < $cabinButtons.length; i++)
  {
    var cabin = $($cabinButtons[i]).attr('id');
    $camperButtons[cabin] = $('.button.camper.' + cabin.replace(' ', '.'));
  }

  for(var i = 0; i < $recBlockButtons.length; i++)
  {
    var recBlock = $($recBlockButtons[i]).attr('id');
    $recButtons[recBlock] = $('.button.rec.' + recBlock);
  }
  
  // Add simple "clicked" message to each button
  $buttons.click(function() {
    console.log('clicked');
  });

  // Detach the cabin, camper and rec buttons from the current view
  $cabinButtons.detach();
  $allCamperButtons.detach();
  $allRecButtons.detach();

  // Add click handler to rec block buttons
  $recBlockButtons.click(function() {
    var recBlock = $(this).attr('id');
    recBlockClicked(recBlock);
  });

  // Add click handler to cabin buttons
  $cabinButtons.click(function() {
    var cabin = $(this).attr('id');
    cabinClicked(cabin);
  });

  // Add click handler to camper buttons
  $allCamperButtons.click(function() {
    var camper = $(this).html();
    camperClicked(camper);
  });

// Functions

// Click handler for rec block buttons
var recBlockClicked = function(recBlock) {
  recAssignment['recBlock'] = recBlock;
  $recBlockButtons.detach();
  $cabinButtons.appendTo('body');
};

// Click handler for cabin buttons
var cabinClicked = function(cabin) {
  recAssignment['cabin'] = cabin;
  console.log('cabin = ' + cabin);

  $cabinButtons.detach();
  $camperButtons[cabin].appendTo('body');
};

var camperClicked = function(camper) {
  recAssignment['camper'] = camper;
  $allCamperButtons.detach();
  $recButtons[recAssignment['recBlock']].appendTo('body');
};


});

// Global var representing current rec assignment
var recAssignment = {};
