$('document').ready(function() {

  // Find out whether to fetch new data from the database or 
  // from sessionStorage
  var useCached = ($('#useCached').html() === 'true');

  var recBlocks = [];
  var cabins = [];
  var campers = {};
  var recs = {};

  // Retrive objects and arrays containing the info needed for all
  // of the buttons
  if(useCached) {
    // Get the items from sessionStorage
    recBlocks = JSON.parse(sessionStorage.getItem('recBlocks'));
    cabins = JSON.parse(sessionStorage.getItem('cabins'));
    campers = JSON.parse(sessionStorage.getItem('campers'));
    recs = JSON.parse(sessionStorage.getItem('recs'));
    console.log('got data from sessionStorage');
  }
  else {
    // Get the items from the divs and
    // cache them in sessionStorage
    recBlocks = JSON.parse($('#recBlocks').html());
    cabins = JSON.parse($('#cabins').html());
    campers = JSON.parse($('#campers').html());
    recs = JSON.parse($('#recs').html());
    console.log('got data from server');

    sessionStorage.setItem('recBlocks', JSON.stringify(recBlocks));
    sessionStorage.setItem('cabins', JSON.stringify(cabins));
    sessionStorage.setItem('campers', JSON.stringify(campers));
    sessionStorage.setItem('recs', JSON.stringify(recs));
    console.log('saved data to sessionStorage');
    
    // Save the fact that there is cached data
    sessionStorage.setItem('useCached', true);
    console.log('set useCached to true');
  }


  // Create the buttons

  var $buttons = $('#buttons');

  // Rec Blocks
  recBlocks.forEach( function(recBlock) {
    var element = '<div class="button recBlock"';
    element += ' id="' + recBlock + '"/>';
    $buttons.append(element);
    var $button = $('#' + recBlock);
    $button.html(recBlock);
  });
  cabins.forEach( function(cabin) {
    var element = '<div class="button cabin"';
    element += ' id="' + cabin.replace(' ', '-') + '"/>';
    $buttons.append(element);
    var $button = $('#' + cabin.replace(' ', '-'));
    $button.html(cabin);
  });
  for(cabin in campers) {
    campers[cabin].forEach( function(camper) {
      var element = '<div class="button camper ' + cabin.replace(' ', '-') + '"';
      element += ' id="' + camper.replace(' ','-') + '-' + cabin.replace(' ', '-') + '"/>';
      $buttons.append(element);
      var $button = $('#' + camper.replace(' ', '-') + '-' + cabin.replace(' ', '-'));
      $button.html(camper);
    });
  }
  for(recBlock in recs) {
    recs[recBlock].forEach( function(rec) {
      var element = '<div class="button rec ' + recBlock + '"';
      element += ' id="' + rec.replace(' ', '-') + '"/>';
      $buttons.append(element);
      var $button = $('#' + rec.replace(' ', '-'));
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
  /*
  if(sessionStorage) {
    sessionStorage.setItem('camperButtons', JSON.stringify($camperButtons));
    sessionStorage.setItem('recBlockButtons', JSON.stringify($recBlockButtons));
    sessionStorage.setItem('cabinButtons', JSON.stringify($cabinButtons));
    sessionStorage.setItem('recButtons', JSON.stringify($recButtons));
    sessionStorage.setItem('allRecButtons', JSON.stringify($allRecButtons));
    sessionStorage.setItem('allCamperButtons', JSON.stringify($allCamperButtons));
  }
  */


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
    var needToSendNewDataString = '<input type="hidden" name="useCached"';
    needToSendNewDataString += ' id="useCachedID" value="';

    if(sessionStorage) {
      needToSendNewDataString += sessionStorage.getItem('useCached');
    }
    else {
      needToSendNewDataString += 'false';
    }
    needToSendNewDataString += '" />';
    $form.append(needToSendNewDataString);

    $form.submit();

  };

});

// Global var representing current rec assignment
var recAssignment = {};
