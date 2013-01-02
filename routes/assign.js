var schemas = require('./schemas');
var Camper = schemas.Camper;
var Rec = schemas.Rec;
var Person = schemas.Person;
var validateCapacity = schemas.validateCapacity;

var getStuff = require('./getStuff');

exports.assign = function(req, res) {
  var weekNumber = req.param('week');
  // Get the Campers
  Camper.find().select('name cabin').exec(function(err) {
    if (err) { throw err; }

    var campersByCabin = getStuff.getCampersByCabin(this)['names'];
    console.log(JSON.stringify(campersByCabin));

    // Get the recs
    Rec.find({'week' : weekNumber})
      .select('name recBlock week')
      .exec(function(err) {
      if (err) { throw err; }
    

      var weekNumber = req.param('week');
      var recsByRecBlock = getStuff.getRecsByRecBlock(this, weekNumber);

      // Render the page
      res.render('assign', {
        title : 'Assign Recs',
        recBlocks : (new Rec()).schema.path('recBlock').enumValues,
        cabins : (new Camper()).schema.path('cabin').enumValues,
        campers : campersByCabin,
        recs : recsByRecBlock,
        weekNum : weekNumber,
      });
    });
  });
};

var dealWithError = function(err, camper, rec, res) {
  if(err === 'Schedule Conflict')
  {
    // Deal with schedule conflict
    // First get the conflicting assignment
    var conflictingRec = {};

    var newDouble = (rec.recBlock === 'double');

    if(!camper.recs.some( function (oldRec) {
      if(oldRec.week === rec.week) {
        var sameRecBlock = (rec.recBlock === oldRec.recBlock);
        var oldDouble = (oldRec.recBlock === 'double');
        if(sameRecBlock || newDouble || oldDouble) {
          conflictingRec = oldRec;
          return true;
        }
        else {
          return false;
        }
      }
    })) {
      throw (err);
    }

    // Give page with resolution options
    res.render('scheduleConflict', {
      title : 'Schedule Conflict',
      camper : camper,
      newRec : rec,
      existingRec : conflictingRec,
    });
  }
  else if(err === 'Rec Over Capacity')
  {
    // Deal with rec over capacity
    res.render('overCapacity', {
      title : 'Rec Over Capacity',
      camper : camper,
      rec : rec,
    });
  }
  else {
    throw (err);
  }
}

exports.submitAssignment = function(req, res) {
  // Get the data to submit
  var assignment = {};
  assignment['camperFirstName'] = req.param('camper').split('-')[0];
  assignment['camperLastName'] = req.param('camper').split('-')[1];
  assignment['recBlock'] = req.param('recBlock');
  assignment['recName'] = req.param('rec');
  assignment['weekNum'] = req.param('week');
  assignment['override'] = (req.param('override') === 'yes');

  console.log('assignment = ' + JSON.stringify(assignment));

  // Find the camper entry
  Camper.findOne( {
    "name.firstName" : assignment['camperFirstName'],
    'name.lastName' : assignment['camperLastName'],
    },
    function(err, camper) {
      if (err) { throw err; }
      console.log('found camper ' + JSON.stringify(camper));
      // Find the rec entry
      Rec.findOne( {
        name : assignment['recName'].replace('-',' '),
        recBlock : assignment['recBlock'],
        week : assignment['weekNum'],
      },
      function(err, rec) {
        if (err) { throw err; }
        console.log('found rec ' + JSON.stringify(rec));

        // update the camper
        camper.recs.push(rec);
        var underCapacity = validateCapacity(camper.recs);
        console.log('underCapacity = ' + underCapacity);
        if(!underCapacity && !assignment['override']) {
          camper.recs.pop();
          dealWithError('Rec Over Capacity', camper, rec, res);
        }
        else{

          // update the rec
          // do this before saving camper because camper has rec as a subdoc
          rec.people.push(camper.name[0]);
          console.log('after rec.people.push\ncamper = ' + JSON.stringify(camper));

          // save the camper
          camper.save(function(err) {
            if (err) {
              if(err.name === 'ValidationError')
              {
                dealWithError(err.errors.recs.type, camper, rec, res);
              }
              else {
                throw (err);
              }
            }
            else {
              console.log('saved camper')
              console.log('camper = ' + JSON.stringify(camper));


              // save the rec
              rec.save(function(err) {
                if (err) { throw err; }
                console.log('saved rec')
                console.log('camper = ' + JSON.stringify(camper));
                // Call the assign page back
                exports.assign(req, res);
              });
            }
          });
        }
      });
    });
};
