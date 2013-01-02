var schemas = require('./schemas');
var Person = schemas.Person;
var Rec = schemas.Rec;
var Camper = schemas.Camper;
var CamperEnumVals = schemas.CamperEnumVals;


exports.index = function(req, res){

  res.render('index', { title : 'Home' } );

};


exports.test = function(req, res){

  var dude = new Person();
  dude.firstName = 'Sam';
  dude.lastName = 'Kohn';

  var rec = new Rec();
  rec.name = 'Phys Fit';
  rec.capacity = 1;
  rec.recBlock = 'first';
  rec.week = 1;

  var camper = new Camper();
  camper.name.push(dude);
  camper.cabin = 'Dorr';

  var dude2 = new Person();
  dude2.firstName = 'Joe';
  dude2.lastName = 'Schmo';

  var camper2 = new Camper();
  camper2.name.push(dude2);
  camper2.cabin = 'Dorr';

  dude.save( function(err) {
    if (err) { throw err; }
    console.log('Dude saved');
    camper.save( function(err) {
      if (err) { throw err; }
      console.log('Camper saved');
    });
  });
  dude2.save( function(err) {
    if (err) { throw err; }
    console.log('Dude saved');
    camper2.save( function(err) {
      if (err) { throw err; }
      console.log('Camper saved');
    });
  });
  rec.save( function(err) {
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
    title: 'Home', 
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
    cabins : (new Camper()).schema.path('cabin').enumValues,
  });
};

exports.batchAddCamper = function(req, res) {
  res.render('batchAddCamper', { 
    title : 'Batch Add Camper', 
    cabins : (new Camper()).schema.path('cabin').enumValues,
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
      cabins : (new Camper()).schema.path('cabin').enumValues,
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
      var person = new Person();
      person.firstName = splitNames[1];
      person.lastName = splitNames[0];

      person.save( function(err) {
        if (err) { throw err; }
        console.log('Person saved');
      });

      var camper = new Camper();
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
    cabins : (new Camper()).schema.path('cabin').enumValues,
  });

}

exports.addRec = function(req, res) {
  res.render('addRec', {
    title : 'Add Rec',
    recBlocks : (new Rec()).schema.path('recBlock').enumValues,
  });
};

exports.batchAddRec = function(req, res) {
  res.render('batchAddRec', {
    title : 'Batch Add Rec',
    recBlocks : (new Rec()).schema.path('recBlock').enumValues,
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
  rec.week= weekNum;

  rec.save( function(err) {
    if (err) { throw err; }
    console.log('Rec saved');
  });
  res.render('addRec', {
    title : 'Add Rec',
    recBlocks : (new Rec()).schema.path('recBlock').enumValues,
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
          var rec = new Rec();
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
    recBlocks : (new Rec()).schema.path('recBlock').enumValues,
  });

};


