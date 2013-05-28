var schemas = require('./schemas');
var Person = schemas.Person;
var Rec = schemas.Rec;
var Camper = schemas.Camper;
var CamperEnumVals = schemas.CamperEnumVals;
var getStuff = require('./getStuff');
var submit = require('./assign').assignSubmit;


exports.index = function(req, res) {

  res.render('index', { title: 'Home' });

};


exports.test = function(req, res) {

  var dude = new Person();
  dude.firstName = 'Sam';
  dude.lastName = 'Kohn';

  var rec1 = new Rec();
  rec1.name = 'Phys Fit';
  rec1.capacity = 9;
  rec1.recBlock = 'first';
  rec1.week = 1;

  var rec2 = new Rec();
  rec2.name = 'Kayaking';
  rec2.capacity = 9;
  rec2.recBlock = 'second';
  rec2.week = 1;

  var camper = new Camper();
  camper.name.push(dude);
  camper.cabin = 'Dorr';

  var dude2 = new Person();
  dude2.firstName = 'Joe';
  dude2.lastName = 'Schmo';

  var camper2 = new Camper();
  camper2.name.push(dude2);
  camper2.cabin = 'Dorr';

  dude.save(function(err) {
    if (err) { throw err; }
    console.log('Dude saved');
    camper.save(function(err) {
      if (err) { throw err; }
      console.log('Camper saved');
    });
  });
  dude2.save(function(err) {
    if (err) { throw err; }
    console.log('Dude saved');
    camper2.save(function(err) {
      if (err) { throw err; }
      console.log('Camper saved');
    });
  });
  rec1.save(function(err) {
    if (err) { throw err; }
    console.log('Rec saved');
  });
  rec2.save(function(err) {
    if (err) { throw err; }
    console.log('Rec saved');
  });

  /*
  console.log('Dude:');
  console.log(JSON.stringify(dude));
  console.log('Rec:');
  console.log(JSON.stringify(rec));
  console.log('Camper:');
  console.log(JSON.stringify(camper));
  */



  res.render('index', {
    title: 'Home'
  });
};

exports.reset = function(req, res) {
  console.log('resetting db');
  Rec.remove({}, function(err) {
    if (err) { throw err; }
    console.log('removed recs');
    Camper.remove({}, function(err) {
      if (err) { throw err; }
      console.log('removed campers');
      Person.remove({}, function(err) {
        if (err) { throw err; }
        console.log('removed people');
        res.render('index', { title: 'Home'});
      });
    });
  });
};


exports.setup = function(req, res) {
  console.log('getting setup');
  res.render('setup', { title: 'Setup' });
  console.log('got setup');
};

exports.addCamper = function(req, res) {
  res.render('addCamper', {
    title: 'Add Camper',
    cabins: (new Camper()).schema.path('cabin').enumValues
  });
};

exports.batchAddCamper = function(req, res) {
  res.render('batchAddCamper', {
    title: 'Batch Add Camper',
    cabins: (new Camper()).schema.path('cabin').enumValues
  });
};

exports.addingCamper = function(req, res) {
  var firstName = req.param('firstName');
  var lastName = req.param('lastName');
  var cabin = req.param('cabin');

  var dude = new Person();
  dude.firstName = firstName;
  dude.lastName = lastName;

  var camperDude = new Camper();
  camperDude.name.push(dude);
  camperDude.cabin = cabin;

  dude.save(function(err) {
    if (err) { throw err; }
    console.log('Person saved');
  });

  camperDude.save(function(err) {
    if (err) { throw err; }
    console.log('Camper saved');
    console.log('Here is the camper: ' + JSON.stringify(this));
    res.render('addCamper', {
      title: 'Add Camper',
      cabins: (new Camper()).schema.path('cabin').enumValues
    });
  });
};

exports.batchAddingCamper = function(req, res) {
  var camperListText = req.body.campers;
  var camperList = camperListText.split('\r\n');

  var cabin = req.body.cabin;


  console.log('second entry in camperList is ' + camperList[1]);

  camperList.forEach(function(name) {
    console.log('name = ' + name);
    var splitNames = name.split(', ');
    console.log('splitNames = ' + splitNames);
    if (splitNames.length != 2) {
      //error!
      var x1 = 0;
    }
    else {
      var person = new Person();
      person.firstName = splitNames[1];
      person.lastName = splitNames[0];

      person.save(function(err) {
        if (err) { throw err; }
        console.log('Person saved');
      });

      var camper = new Camper();
      camper.name.push(person);
      camper.cabin = cabin;

      camper.save(function(err) {
        if (err) { throw err; }
        console.log('Camper saved');
        console.log('Here is the camper: ' + JSON.stringify(this));
      });
    }
  });


  res.render('batchAddcamper', {
    title: 'Add Camper',
    cabins: (new Camper()).schema.path('cabin').enumValues
  });

};

exports.addRec = function(req, res) {
  res.render('addRec', {
    title: 'Add Rec',
    recBlocks: (new Rec()).schema.path('recBlock').enumValues
  });
};

exports.batchAddRec = function(req, res) {
  res.render('batchAddRec', {
    title: 'Batch Add Rec',
    recBlocks: (new Rec()).schema.path('recBlock').enumValues
  });
};

exports.addingRec = function(req, res) {
  var recName = req.param('name');
  var recCapacity = req.param('capacity');
  var recRecBlock = req.param('recBlock');
  var weekNum = req.param('weekNum');

  var rec = new Rec();
  rec.name = recName;
  rec.capacity = recCapacity;
  rec.recBlock = recRecBlock;
  rec.week = weekNum;

  rec.save(function(err) {
    if (err) { throw err; }
    console.log('Rec saved');
  });
  res.render('addRec', {
    title: 'Add Rec',
    recBlocks: (new Rec()).schema.path('recBlock').enumValues
  });
};

exports.batchAddingRec = function(req, res) {
  var recListText = req.body.recs;
  var recList = recListText.split('\r\n');
  var recBlocks = req.body.recBlocks;
  var weeks = req.body.weeks;

  // Resolve shorthand for all weeks
  if (weeks === 'all')
  {
    weeks = [1, 2, 3, 4];
  }

  console.log('recList = ' + JSON.stringify(recList));
  console.log('recBlocks = ' + JSON.stringify(recBlocks));
  console.log('weeks = ' + JSON.stringify(weeks));

  recList.forEach(function(recLine, index) {
    console.log('recLine = ' + recLine);
    var splitRecLine = recLine.split(', ');
    console.log('splitRecLine = ' + splitRecLine);
    if (splitRecLine.length != 2)
    {
      //ERROR!
      var aklsdjf = 0;
    }
    else
    {
      recBlocks.forEach(function(block) {
        weeks.forEach(function(week) {
          var rec = new Rec();
          rec.name = splitRecLine[0];
          rec.capacity = splitRecLine[1];
          rec.recBlock = block;
          rec.week = week;

          rec.save(function(err) {
            if (err) { throw err; }
            console.log('Rec saved');
            console.log('Here is the rec: ' + JSON.stringify(this));
          });
        });
      });
    }
  });

  res.render('batchAddRec', {
    title: 'Add Rec',
    recBlocks: (new Rec()).schema.path('recBlock').enumValues
  });

};

exports.removeCamper = function(req, res) {
  Camper.find().select('name cabin').sort('name').exec(function(err) {
    if (err) { throw err; }

    // Get the camper names, split up by cabin
    var campersByCabin = getStuff.getCampersByCabin(this)['names'];
    res.render('removeCamper', {
      title: 'Remove Camper',
      campersByCabin: campersByCabin
    });
  });
};

exports.removeRec = function(req, res) {
  var week = req.query.week;
  Rec.find({week: week}).select('name recBlock week').sort('recBlock name').
      exec(function(err) {
        if (err) { throw err; }
        var recsByRecBlock = getStuff.getRecsByRecBlock(this);
        res.render('removeRec', {
          title: 'Remove Rec',
          recsByRecBlock: recsByRecBlock
        });
      });
};


exports.removingCamper = function(req, res) {
  var camperName = req.body.camper.split(' ');
  var cabin = req.body.cabin.replace('-', ' ');

  // first find the camper
  Camper.find({
    'name.firstName' : camperName[0],
    'name.lastName' : camperName[1],
    'cabin' : cabin
  },
  function(err, campers) {
    if (err) { throw err; }
    console.log('found ' + campers.length + ' campers:' +
        JSON.stringify(campers));
    if (campers.length === 0) {
      res.render('removedCamperError', {
        title: 'No Matching Camper Found'
      });
    }
    else if (campers.length > 1) {
      res.render('removedCamperError', {
        title: 'More than 1 Matching Camper Found'
      });
    }
    else { // if campers.length === 1

      // remove the camper from the Camper db collection
      Camper.findOneAndRemove(campers[0], function(err, removed) {

        // remove the camper's name from the People db collection
        // (asynchronously)
        Person.findOneAndRemove(removed.name[0], function(err, removedItem) {
          console.log('removed person ' + JSON.stringify(removedItem));
        });

        // next remove the camper from all of the recs he was in

        removed.recs.forEach(function(rec) {

          // find each rec
          Rec.findOne({
            name: rec.name,
            recBlock: rec.recBlock
          },
          function(err, foundRec) {
            if (err) { throw err; }
            console.log('found rec ' + rec.name);

            // remove one instance of the camper's name
            // this allows for multiple campers with the
            // same name.
            foundRec.people.some(function(name, index) {
              if (name.firstName === removed.name[0].firstName) {
                if (name.lastName === removed.name[0].lastName) {
                  foundRec.people.splice(index, 1);

                  // save the updated rec
                  foundRec.save(function(err) {
                    if (err) { throw err; }
                    console.log('saved rec, which looks like ' +
                        JSON.stringify(this));
                  });
                }
              }
            });
          });
        });


        res.render('removedCamper', {
          title: 'Removed Camper',
          camper: removed
        });
      });

    }
  });


};

exports.removingRec = function(req, res) {
  var recName = req.body.rec;
  var recBlock = req.body.recBlock;

  // first find the rec
  Rec.find({
    'name' : recName,
    'recBlock' : recBlock
  },
  function(err, recs) {
    if (err) { throw err; }
    console.log('found ' + recs.length + ' recs:' + JSON.stringify(recs));
    if (recs.length === 0) {
      res.render('removedRecError', {
        title: 'No Matching Rec Found'
      });
    }
    else if (recs.length > 1) {
      res.render('removedRecError', {
        title: 'More than 1 Matching Rec Found'
      });
    }
    else { // if recs.length === 1

      // remove the rec from the Rec db collection
      Rec.findOneAndRemove(recs[0], function(err, removed) {

        // next remove the rec from all of the campers who signed up for it
        res.render('removedRec', {
          title: 'Removed Rec',
          rec: removed
        });
      });

    }
  });


};

exports.undoRemoveCamper = function(req, res) {
  var camper = JSON.parse(req.body.camper);
  var recsToAssign = camper.recs;
  console.log('the camper to undo is ' + JSON.stringify(camper));

  // Set up the camper
  var newCamper = new Camper();
  var newPerson = new Person();
  newPerson.firstName = camper.name[0].firstName;
  newPerson.lastName = camper.name[0].lastName;

  newPerson.save(function(err) {
    if (err) { throw err; }
    console.log('saved new person');


    newCamper.name.push(newPerson);
    newCamper.cabin = camper.cabin;

    newCamper.save(function(err) {
      if (err) { throw err; }


      recsToAssign.forEach(function(rec) {
        var assignment = {};
        assignment['camperFirstName'] = camper.name[0].firstName;
        assignment['camperLastName'] = camper.name[0].lastName;
        assignment['cabin'] = camper.cabin;
        // Always override capacity issues since this person
        // was already assigned to these recs
        // There should be no schedule conflicts since all these
        // recs used to be OK
        assignment['override'] = true;
        assignment['recBlock'] = rec.recBlock;
        assignment['recName'] = rec.name;
        assignment['weekNum'] = rec.week;

        submit(null, null, assignment, function() {
          console.log('submitted re-assignment for the rec ' +
              JSON.stringify(rec));
        });

      });

      res.render('index', {
        title: 'Home'
      });
    });
  });
};


