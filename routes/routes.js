// mongoose stuff

var mongoose = require('mongoose');
//var db = mongoose.connect('mongodb://localhost:27017/recsignups');
if(process.env.MONGOHQ_URL)
{
  url = process.env.MONGOHQ_URL;
}
else
{
  url = 'mongodb://localhost:27017/recsignups';
}
var db = mongoose.connect(url);
var Schema = mongoose.Schema;

// Schemas
//
// Validation 
// (enums)

var recBlocks = 'first second double'.split(' ');
var cabins = 'Dorr.Smith.Sault.Burns.Towne.Wade.Up Dorm.Down Dorm'.split('.');

// (functions)

var validateNoScheduleConflict = function(recs) {
  // We pop here but push at the end so recs is unaltered
  var newRec = recs[recs.length-1];
  var newDouble = (newRec.recBlock === 'double');
  for(var i = 0; i < recs.length-1; i++)
  {
    if(newRec.week === recs[i].week)
    {
      var sameRecBlock = (newRec.recBlock === recs[i].recBlock);
      var oldDouble = (recs[i].recBlock === 'double');
      if(sameRecBlock || newDouble || oldDouble)
      {
        return false;
      }
    }
  }
  return true;
};

var validateCapacity = function(recs) {
  // We pop here but push at the end so recs is unaltered
  console.log('validating capacity');
  var newRec = recs[recs.length-1];
  console.log('newRec = ' + JSON.stringify(newRec));
  if(newRec.people.length + 1 > newRec.capacity) {
    return false;
  }
  else {
    return true;
  }
}

var Person = new Schema( {
  firstName : String,
  lastName : String,
});

var Rec = new Schema( {
  name : String,
  capacity : Number,
  week : Number,
  recBlock : { type : String, enum : recBlocks },
  people : [Person],
});

var Camper = new Schema( {
  name : [Person],
  recs : [Rec],
  cabin : { type : String, enum : cabins},
});


// Models

var PersonModel = mongoose.model('Person', Person);
var RecModel = mongoose.model('Rec', Rec);
var CamperModel = mongoose.model('Camper', Camper);
//
// Apply validation

CamperModel.schema.path('recs').validate(validateNoScheduleConflict, 'Schedule Conflict');

/*
 * GET home page.
 */

exports.index = function(req, res){

  res.render('index', { title : 'Home' } );

};


exports.test = function(req, res){

  var dude = new PersonModel();
  dude.firstName = 'Sam';
  dude.lastName = 'Kohn';

  var rec = new RecModel();
  rec.name = 'Phys Fit';
  rec.capacity = 1;
  rec.recBlock = 'first';
  rec.week = 1;

  var camper = new CamperModel();
  camper.name.push(dude);
  camper.cabin = 'Dorr';

  var dude2 = new PersonModel();
  dude2.firstName = 'Joe';
  dude2.lastName = 'Schmo';

  var camper2 = new CamperModel();
  camper2.name.push(dude2);
  camper2.cabin = 'Dorr';

  dude.save( function(err) {
    if (err) { throw err; }
    console.log('Dude saved');
  });
  dude2.save( function(err) {
    if (err) { throw err; }
    console.log('Dude saved');
  });
  rec.save( function(err) {
    if (err) { throw err; }
    console.log('Rec saved');
  });
  camper.save( function(err) {
    if (err) { throw err; }
    console.log('Camper saved');
  });
  camper2.save( function(err) {
    if (err) { throw err; }
    console.log('Camper saved');
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
    title: 'Home', 
  });
};

exports.reset = function(req, res) {
  console.log('resetting db');
  RecModel.remove({}, function(err) {
    if (err) { throw err; }
    console.log('removed recs');
    CamperModel.remove({}, function(err) {
      if (err) { throw err; }
      console.log('removed campers');
      PersonModel.remove({}, function(err) {
        if (err) { throw err; }
        console.log('removed people');
        res.render('index', { title : 'Home'});
      });
    });
  });
};


exports.setup = function(req, res) {
  console.log('getting setup');
  res.render('setup', { title : 'Setup' });
  console.log('got setup');
};

exports.addCamper = function(req, res) {
  res.render('addCamper', {
    title : 'Add Camper', 
    cabins : (new CamperModel()).schema.path('cabin').enumValues,
  });
};

exports.batchAddCamper = function(req, res) {
  res.render('batchAddCamper', { 
    title : 'Batch Add Camper', 
    cabins : (new CamperModel()).schema.path('cabin').enumValues,
  });
};

exports.addingCamper = function(req, res) {
  var firstName = req.param('firstName');
  var lastName = req.param('lastName');
  var cabin = req.param('cabin');

  var dude = new PersonModel();
  dude.firstName = firstName;
  dude.lastName = lastName;

  var camperDude = new CamperModel();
  camperDude.name.push(dude);
  camperDude.cabin = cabin;

  dude.save( function(err) {
    if (err) { throw err; }
    console.log('Person saved');
  });

  camperDude.save( function(err) {
    if (err) { throw err; }
    console.log('Camper saved');
    console.log('Here is the camper: ' + JSON.stringify(this));
    res.render('addCamper', { 
      title : 'Add Camper', 
      cabins : (new CamperModel()).schema.path('cabin').enumValues,
  });
  });
};

exports.batchAddingCamper = function(req, res) {
  var camperListText = req.body.campers;
  var camperList = camperListText.split('\n');

  var cabin = req.body.cabin;


  console.log('second entry in camperList is ' + camperList[1]);

  camperList.forEach( function(name) {
    console.log('name = ' + name);
    var splitNames = name.split(', ');
    console.log('splitNames = ' + splitNames);
    if (splitNames.length != 2) {
      //error!
      var x1 = 0;
    }
    else {
      var person = new PersonModel();
      person.firstName = splitNames[1];
      person.lastName = splitNames[0];

      person.save( function(err) {
        if (err) { throw err; }
        console.log('Person saved');
      });

      var camper = new CamperModel();
      camper.name.push(person);
      camper.cabin = cabin;

      camper.save( function(err) {
        if (err) { throw err; }
        console.log('Camper saved');
        console.log('Here is the camper: ' + JSON.stringify(this));
      });
    }
  });


  res.render('batchAddcamper', {
    title : 'Add Camper',
    cabins : (new CamperModel()).schema.path('cabin').enumValues,
  });

}

exports.addRec = function(req, res) {
  res.render('addRec', {
    title : 'Add Rec',
    recBlocks : (new RecModel()).schema.path('recBlock').enumValues,
  });
};

exports.batchAddRec = function(req, res) {
  res.render('batchAddRec', {
    title : 'Batch Add Rec',
    recBlocks : (new RecModel()).schema.path('recBlock').enumValues,
  });
};

exports.addingRec = function(req, res) {
  var recName = req.param('name');
  var recCapacity = req.param('capacity');
  var recRecBlock = req.param('recBlock');
  var weekNum = req.param('weekNum');

  var rec = new RecModel();
  rec.name = recName;
  rec.capacity = recCapacity;
  rec.recBlock = recRecBlock;
  rec.week= weekNum;

  rec.save( function(err) {
    if (err) { throw err; }
    console.log('Rec saved');
  });
  res.render('addRec', {
    title : 'Add Rec',
    recBlocks : (new RecModel()).schema.path('recBlock').enumValues,
  });
};

exports.batchAddingRec = function(req, res) {
  var recListText = req.body.recs;
  var recList = recListText.split('\n');
  var recBlocks = req.body.recBlocks;
  var weeks = req.body.weeks;

  // Resolve shorthand for all weeks
  if(weeks === 'all')
  {
    weeks = [1,2,3,4];
  }

  console.log('recList = ' + JSON.stringify(recList));
  console.log('recBlocks = ' + JSON.stringify(recBlocks));
  console.log('weeks = ' + JSON.stringify(weeks));

  recList.forEach( function(recLine, index) {
    console.log('recLine = ' + recLine);
    var splitRecLine = recLine.split(', ');
    console.log('splitRecLine = ' + splitRecLine);
    if(splitRecLine.length != 2)
    {
      //ERROR!
      var aklsdjf = 0;
    }
    else
    {
      recBlocks.forEach( function(block) {
        weeks.forEach( function(week) {
          var rec = new RecModel();
          rec.name = splitRecLine[0];
          rec.capacity = splitRecLine[1];
          rec.recBlock = block;
          rec.week = week;

          rec.save( function(err) {
            if (err) { throw err; }
            console.log('Rec saved');
            console.log('Here is the rec: ' + JSON.stringify(this));
          });
        });
      });
    }
  });

  res.render('batchAddRec', {
    title : 'Add Rec',
    recBlocks : (new RecModel()).schema.path('recBlock').enumValues,
  });

};


exports.assign = function(req, res) {
  var weekNumber = req.param('week');
  // Get the Campers
  CamperModel.find().select('name cabin').exec(function(err) {
    if (err) { throw err; }

    var campersByCabin = getCampersByCabin(this)['names'];
    console.log(JSON.stringify(campersByCabin));

    // Get the recs
    RecModel.find({'week' : weekNumber})
      .select('name recBlock week')
      .exec(function(err) {
      if (err) { throw err; }
    

      var weekNumber = req.param('week');
      var recsByRecBlock = getRecsByRecBlock(this, weekNumber);

      // Render the page
      res.render('assign', {
        title : 'Assign Recs',
        recBlocks : (new RecModel()).schema.path('recBlock').enumValues,
        cabins : (new CamperModel()).schema.path('cabin').enumValues,
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
  CamperModel.findOne( {
    "name.firstName" : assignment['camperFirstName'],
    'name.lastName' : assignment['camperLastName'],
    },
    function(err, camper) {
      if (err) { throw err; }
      console.log('found camper ' + JSON.stringify(camper));
      // Find the rec entry
      RecModel.findOne( {
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


var getCampersByCabin = function(resultOfQuery) {
  var people = resultOfQuery['emitted']['complete'][0];
  var campersByCabin = {
      campers : {},
      names : {},
    };
  var cabins = (new CamperModel()).schema.path('cabin').enumValues;

  for(var i = 0; i < cabins.length; i++)
  {
    campersByCabin[cabins[i]] = {};
    campersByCabin['campers'][cabins[i]] = new Array();
    campersByCabin['names'][cabins[i]] = new Array();
  }

  for(var i = 0; i < people.length; i++)
  {
    var camper = people[i];
    var firstName = people[i]['name'][0]['firstName'];
    var lastName = people[i]['name'][0]['lastName'];
    var name = firstName + ' ' + lastName;
    var cabin = people[i]['cabin'];
    campersByCabin['campers'][cabin].push(camper);
    campersByCabin['names'][cabin].push(name);
  }
  return campersByCabin;
};

var getCampersByRec = function(resultOfQuery) {
  var recs = resultOfQuery['emitted']['complete'][0];

  var campersByRec = {};
  for(var i = 0; i < recs.length; i++)
  {
    campersByRec[recs[i]['name']] = {};
  }

  for(var i = 0; i < recs.length; i++)
  {
    var recName = recs[i]['name'];
    var recBlock = recs[i]['recBlock'];
    campersByRec[recName][recBlock] = new Array();
    var people = recs[i]['people'];
    for(var j = 0; j < people.length; j++)
    {
      var firstName = people[j]['firstName'];
      var lastName = people[j]['lastName'];
      var name = firstName + ' ' + lastName;
      campersByRec[recName][recBlock].push(name);
    }
  }
  return campersByRec;
};

var getRecsByRecBlock = function(resultOfQuery) {
  var recs = resultOfQuery['emitted']['complete'][0];
  console.log('recs = ' + recs);
  var recsByRecBlock = {};
  var recBlocks= (new RecModel()).schema.path('recBlock').enumValues;
  console.log('recBlocks = ' + recBlocks);
  console.log('recBlocks.length = ' + recBlocks.length);

  for(var i = 0; i < recBlocks.length; i++)
  {
    recsByRecBlock[recBlocks[i]] = new Array();
  }

  for(var i = 0; i < recs.length; i++)
  {
    var name = recs[i]['name'];
    console.log('name = ' + name);
    var recBlock = recs[i]['recBlock'];
    console.log('recBlock = ' + recBlock);
    recsByRecBlock[recBlock].push(name);
  }
  return recsByRecBlock;
};

exports.attendance = function(req, res) {
  RecModel.find({'week':req.param('week')}).select('name people recBlock').exec(function (err) {
    var campersByRec = getCampersByRec(this);

    res.render('attendance', {
      title : 'Attendance',
      campers : campersByRec,
    });
  });
};

exports.cabinList = function(req, res) {
  CamperModel.find().exec(function (err) {
    if (err) { throw err; }
    var campersByCabin = getCampersByCabin(this);
    console.log(JSON.stringify(campersByCabin));

    res.render('cabinList', {
      title : 'Cabin Lists',
      campersByCabin : campersByCabin,
    });
  });
};


