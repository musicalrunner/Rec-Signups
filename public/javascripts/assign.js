$('document').ready(function() {

  // Get Buttons
  var $buttons = $('.button');
  var $recBlockButtons = $('.button.recBlock');
  var $cabinButtons = $('.button.cabin');
  var $allCamperButtons = $('.button.camper');
  var $camperButtons = {};
  var $allRecButtons = $('.button.rec');
  var $recButtons = {};

  // Set up camper buttons by cabin
  for(var i = 0; i < $cabinButtons.length; i++)
  {
    var cabin = $($cabinButtons[i]).attr('id');
    $camperButtons[cabin] = $('.button.camper.' + cabin.replace(' ', '.'));
  }

  // Set up rec buttons by rec block
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

  // Add click handler to rec buttons--includes wrapping in <form />
  $allRecButtons.click(function() {
    recClicked(this);
  }); 


// Functions

// Click handler for rec block buttons
var recBlockClicked = function(recBlock) {
  recAssignment['recBlock'] = recBlock;
  $recBlockButtons.detach();
  $cabinButtons.appendTo('#buttons');
};

// Click handler for cabin buttons
var cabinClicked = function(cabin) {
  recAssignment['cabin'] = cabin;
  console.log('cabin = ' + cabin);

  $cabinButtons.detach();
  $camperButtons[cabin].appendTo('#buttons');
};

var camperClicked = function(camper) {
  recAssignment['camper'] = camper;
  $allCamperButtons.detach();
  $recButtons[recAssignment['recBlock']].appendTo('#buttons');
  $recButtons[recAssignment['recBlock']].wrap(function(index) {
    var toReturn = '<form method="POST" id="';
    toReturn += $(this).html().replace(' ', '-') + '-form"/>';
    return toReturn;
  });
};

var recClicked = function(button) {
  $allRecButtons.detach();
  var rec = $(button).html();
  recAssignment['rec'] = rec;
  var $form = $('#' + rec.replace(' ', '-') + '-form');

  $form.attr('action', '/assign/submit');
  for(field in recAssignment)
  {
    console.log('field = ' + field);
    console.log('recAssignment[field] = ' + recAssignment[field]);
    var value = recAssignment[field];
    var nValue = value.replace(' ', '-');
    var nField = field.replace(' ', '-');
    var inputString = '<input type="text" name="' + nField + '"';
    inputString += ' id="' + nField + '-input" value="' + nValue + '" />';
    $form.append(inputString);
    $('#' + nField + '-input').hide();
  }

  var weekNumString = '<input type="hidden" name="weekNum"';
  weekNumString += ' id="weekNumInputID" value="' + $('#weekNumber').html() + '" />';
  $form.append(weekNumString);

  $form.submit();

};

});

// Global var representing current rec assignment
var recAssignment = {};
