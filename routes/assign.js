var schemas = require('./schemas');
var Camper = schemas.Camper;
var Rec = schemas.Rec;
var Person = schemas.Person;
var validateCapacity = schemas.validateCapacity;

var getStuff = require('./getStuff');

exports.assignSubmit = function(req, res, assignment, callback) {

  // Find the camper entry
  Camper.findOne({
    'name.firstName': assignment['camperFirstName'],
    'name.lastName': assignment['camperLastName'],
    'cabin': assignment['cabin']
  },
  function(err, camper) {
    if (err) { throw err; }
    console.log('found camper ' + JSON.stringify(camper));
    // Find the rec entry
    Rec.findOne({
      name: assignment['recName'].replace('-', ' '),
      recBlock: assignment['recBlock'],
      week: assignment['weekNum']
    },
    function(err, rec) {
      if (err) { throw err; }
      console.log('found rec ' + JSON.stringify(rec));

      // Check to see if adding the camper would put the rec
      // over capacity
      var underCapacity = validateCapacity(rec);
      console.log('underCapacity = ' + underCapacity);
      if (!underCapacity && !assignment['override']) {
        dealWithError('Rec Over Capacity', camper, rec, req, res);
      }
      else {
        // update the camper
        camper.recs.push(rec);

        // update the rec
        // do this before saving camper because camper has rec as a subdoc
        rec.people.push(camper.name[0]);
        console.log('after rec.people.push\ncamper = ' +
            JSON.stringify(camper));

        // save the camper
        camper.save(function(err) {
          if (err) {
            if (err.name === 'ValidationError')
            {
              dealWithError(err.errors.recs.type, camper, rec, req, res);
            }
            else {
              throw (err);
            }
          }
          else {
            console.log('saved camper');
            console.log('camper = ' + JSON.stringify(camper));


            // save the rec
            rec.save(function(err) {
              if (err) { throw err; }
              console.log('saved rec');
              console.log('camper = ' + JSON.stringify(camper));
              // call the callback!
              callback(req, res);
            });
          }
        });
      }
    });
  });
};

exports.assign = function(req, res) {

  var weekNumber = req.param('week');

  // caching cabin, camper, and rec names. if there's a change
  // then send new copies.
  var useCached = (req.param('useCached') === 'true');

  if (!useCached) {

    // Get the Campers
    Camper.find().select('name cabin').sort('name').exec(function(err) {
      if (err) { throw err; }

      // Get only the names (i.e. not the rec list) of campers, divided by cabin
      var campersByCabin = getStuff.getCampersByCabin(this)['names'];
      console.log(JSON.stringify(campersByCabin));

      // Get the recs
      Rec.find({'week': weekNumber})
        .select('name recBlock week')
        .sort('name')
        .exec(function(err) {
            if (err) { throw err; }

            var weekNumber = req.param('week');
            var recsByRecBlock = getStuff.getRecsByRecBlock(this, weekNumber);

            // Render the page
            res.render('assign', {
              title: 'Assign Recs',
              recBlocks: (new Rec()).schema.path('recBlock').enumValues,
              cabins: (new Camper()).schema.path('cabin').enumValues,
              campers: campersByCabin,
              recs: recsByRecBlock,
              weekNum: weekNumber,
              useCached: false
            });
          });
    });
  }
  else {
    res.render('assign', {
      title: 'Assign Recs',
      recBlocks: [],
      cabins: [],
      campers: [],
      recs: [],
      weekNum: weekNumber,
      useCached: true
    });
  }

};

var dealWithError = function(err, camper, rec, req, res) {
  if (err === 'Schedule Conflict')
  {
    // Deal with schedule conflict
    // First get the conflicting assignment
    var conflictingRec = {};

    var newDouble = (rec.recBlock === 'double');

    if (!camper.recs.some(function(oldRec) {
      if (oldRec.week === rec.week) {
        var sameRecBlock = (rec.recBlock === oldRec.recBlock);
        var oldDouble = (oldRec.recBlock === 'double');
        if (sameRecBlock || newDouble || oldDouble) {
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

    // If the camper is already in that rec, alert so and then
    // re-load the assign page
    var sameRec = false;
    if (conflictingRec.name === rec.name) {
      sameRec = true;
    }

    // Give page with resolution options
    res.render('scheduleConflict', {
      title: 'Schedule Conflict',
      camper: camper,
      newRec: rec,
      existingRec: conflictingRec,
      isSameRec: sameRec
    });
  }
  else if (err === 'Rec Over Capacity')
  {
    // Deal with rec over capacity
    res.render('overCapacity', {
      title: 'Rec Over Capacity',
      camper: camper,
      rec: rec
    });
  }
  else {
    throw (err);
  }
};

exports.submitAssignment = function(req, res) {
  // Get the data to submit
  var assignment = {};
  assignment['camperFirstName'] = req.param('camper').split('-')[0];
  assignment['camperLastName'] = req.param('camper').split('-')[1];
  assignment['recBlock'] = req.param('recBlock');
  assignment['cabin'] = req.param('cabin');
  assignment['recName'] = req.param('rec');
  assignment['weekNum'] = req.param('week');
  assignment['override'] = (req.param('overrideCapacity') === 'yes');

  exports.assignSubmit(req, res, assignment, function(req, res) {
    exports.assign(req, res);
  });

};

exports.overwriteAssignment = function(req, res) {
  // Get the data to submit
  var assignment = {};
  assignment['camperFirstName'] = req.param('camper').split('-')[0];
  assignment['camperLastName'] = req.param('camper').split('-')[1];
  assignment['recBlock'] = req.param('recBlock');
  assignment['recName'] = req.param('rec');
  assignment['weekNum'] = req.param('week');
  assignment['override'] = (req.param('overrideCapacity') === 'yes');

  console.log('assignment = ' + JSON.stringify(assignment));

  // Find the camper entry
  Camper.findOne({
    'name.firstName': assignment['camperFirstName'],
    'name.lastName': assignment['camperLastName']
  },
  function(err, camper) {
    if (err) { throw err; }
    console.log('found camper ' + JSON.stringify(camper));
    // Find the rec entry
    Rec.findOne({
      name: assignment['recName'].replace('-', ' '),
      recBlock: assignment['recBlock'],
      week: assignment['weekNum']
    },
    function(err, rec) {
      if (err) { throw err; }
      console.log('found rec ' + JSON.stringify(rec));

      // update the camper: delete old assignment

      // Find the old assignment
      camper.recs.forEach(function(testRec, index) {
        if (rec.week === testRec.week) {
          var sameRec = rec.recBlock === testRec.recBlock;
          var newDouble = rec.recBlock === 'double';
          var oldDouble = testRec.recBlock === 'double';
          if (sameRec || newDouble || oldDouble) {
            // Found the old assignment
            // delete (splice) the rec from the camper's list
            var removed = camper.recs.splice(index, 1)[0];
            console.log('removed rec from camper: ' +
                JSON.stringify(removed));

            // Remove the camper from the rec's attendance list
            // first retrieve the (old) rec
            Rec.findOne({
              name: removed.name,
              week: removed.week,
              recBlock: removed.recBlock
            },
            function(err, oldRec) {

              // find the camper
              console.log('removed.people = ' +
                  JSON.stringify(oldRec.people));
              oldRec.people.forEach(function(person, index) {
                if (person.firstName === camper.name[0].firstName) {
                  if (person.lastName === camper.name[0].lastName) {
                    // found the camper. delete (splice) the camper

                    var removedCamper = oldRec.people.splice(index, 1)[0];
                    console.log('about to remove this camper from the ' +
                        'previously stated rec: ' +
                        JSON.stringify(removedCamper));

                    // save the modified rec (OK to happen asynchronously)
                    oldRec.save(function(err) {
                      if (err) { throw err; }
                      console.log('succeeded in removing camper from rec');
                      console.log('here\'s the saved rec: ' +
                          JSON.stringify(this));
                    });
                  }
                }
              });
            });
          }
        }
      });

      var underCapacity = validateCapacity(rec);
      console.log('underCapacity = ' + underCapacity);
      if (!underCapacity && !assignment['override']) {
        dealWithError('Rec Over Capacity', camper, rec, res);
      }
      else {
        camper.recs.push(rec);

        // update the rec
        // do this before saving camper because camper has rec as a subdoc
        rec.people.push(camper.name[0]);
        console.log('after rec.people.push\ncamper = ' +
            JSON.stringify(camper));

        // save the camper
        camper.save(function(err) {
          if (err) {
            if (err.name === 'ValidationError')
            {
              dealWithError(err.errors.recs.type, camper, rec, res);
            }
            else {
              throw (err);
            }
          }
          else {
            console.log('saved camper');
            console.log('camper = ' + JSON.stringify(camper));


            // save the rec
            rec.save(function(err) {
              if (err) { throw err; }
              console.log('saved rec');
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
