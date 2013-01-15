$('document').ready(function() {

  // Find out whether to fetch new data from the database or 
  // from localStorage
  var useCached = $('#useCached').html();

  var recBlocks = [];
  var cabins = [];
  var campers = {};
  var recs = {};

  // Retrive objects and arrays containing the info needed for all
  // of the buttons
  if(useCached) {
    // Get the items from localStorage
    recBlocks = JSON.parseJSON(localStorage.getItem('recBlocks'));
    cabins = JSON.parseJSON(localStorage.getItem('cabins'));
    campers = JSON.parseJSON(localStorage.getItem('campers'));
    recs = JSON.parseJSON(localStorage.getItem('recs'));
  }
  else {
    // Get the items from the divs
    recBlocks = JSON.parseJSON($('#recBlocks').html());
    cabins = JSON.parseJSON($('#cabins').html());
    campers = JSON.parseJSON($('#campers').html());
    recs = JSON.parseJSON($('#recs').html());
  }


  // Create the buttons

  var $buttons = $('#buttons');

  // Rec Blocks
  recBlocks.forEach( function(recBlock) {
    var element = '<div class="button recBlock"';
    element += ' id="' + recBlock + '"/>;
    $buttons.append(element);
    var $button = $('#' + recBlock);
    $button.html(recBlock);
  });
  cabins.forEach( function(cabin) {
    var element = '<div class="button cabin"';
    element += ' id="' + cabin + '"/>;
    $buttons.append(element);
    var $button = $('#' + cabin);
    $button.html(cabin);
  });
  for(cabin in campers) {
    campers[cabin].forEach( function(camper) {
      var element = '<div class="button camper ' + cabin + '"';
      element += ' id="' + camper + '-' + cabin + '"/>;
      $buttons.append(element);
      var $button = $('#' + camper + '-' + cabin);
      $button.html(camper);
    });
  }
  for(recBlock in recs) {
    recs[recBlock].forEach( function(rec) {
      var element = '<div class="button rec ' + recBlock + '"';
      element += ' id="' + rec + '"/>;
      $buttons.append(element);
      var $button = $('#' + rec);
      $button.html(rec);
    });
  }


  // Get Buttons
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
  

  // Save this data locally
  if(localStorage) {
    localStorage.setItem('camperButtons', JSON.stringify($camperButtons));
    localStorage.setItem('recBlockButtons', JSON.stringify($recBlockButtons));
    localStorage.setItem('cabinButtons', JSON.stringify($cabinButtons));
    localStorage.setItem('recButtons', JSON.stringify($recButtons));
    localStorage.setItem('allRecButtons', JSON.stringify($allRecButtons));
    localStorage.setItem('allCamperButtons', JSON.stringify($allCamperButtons));
  }


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

  // Click handler for camper buttons
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

  // Click handler for rec buttons
  var recClicked = function(button) {
    $allRecButtons.detach();
    var rec = $(button).html();
    recAssignment['rec'] = rec;
    var $form = $('#' + rec.replace(' ', '-') + '-form');

    $form.attr('action', '/assign/submit');

    // add the details of the assignment to the form
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

    // add the week number to the form
    var weekNumString = '<input type="hidden" name="week"';
    weekNumString += ' id="weekNumInputID" value="' + $('#weekNumber').html() + '" />';
    $form.append(weekNumString);


    // add whether there have been any changes since
    // the last assignment submission to the form
    var needToSendNewDataString = '<input type="hidden" name="sendNewData"';
    needToSendNewDataString += ' id="sendNewDataID" value="';

    if(localStorage) {
      needToSendNewDataString += localStorage.getItem('newData');
    }
    else {
      needToSendNewDataString += 'true';
    }
    needToSendNewDataString += '" />';
    $form.append(needToSendNewDataString);

    $form.submit();

  };

});

// Global var representing current rec assignment
var recAssignment = {};
