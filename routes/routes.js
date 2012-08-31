// mongoose stuff

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/recsignups');
var Schema = mongoose.Schema;

// Schemas
//
// Validation (enums)

var recBlocks = 'first second double'.split(' ');
var cabins = 'Dorr.Smith.Sault.Burns.Towne.Wade.Up Dorm.Down Dorm'.split('.');

//
// Invariant : for each rec in camper.rec, rec.campers must contain camper.name

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

/*
var Cabin = new Schema( {
  name : String,
  campers : [Camper],
});
*/
  

// Models

var PersonModel = mongoose.model('Person', Person);
var RecModel = mongoose.model('Rec', Rec);
var CamperModel = mongoose.model('Camper', Camper);
//var CabinModel = mongoose.model('Cabin', Cabin);

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
  rec.capacity = 25;
  rec.recBlock = 'first';
  rec.people.push(dude);

  var camper = new CamperModel();
  camper.name.push(dude);
  camper.recs.push(rec);
  camper.cabin = 'Dorr';

  /*
  var cabin = new CabinModel();
  cabin.name = 'Dorr';
  cabin.campers.push(camper);
  */

  dude.save( function(err) {
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
  /*
  cabin.save( function(err) {
    if (err) { throw err; }
    console.log('Cabin saved');
  });
  */

  console.log('Dude:');
  console.log(JSON.stringify(dude));
  console.log('Rec:');
  console.log(JSON.stringify(rec));
  console.log('Camper:');
  console.log(JSON.stringify(camper));
  //console.log('Cabin:');
  //console.log(JSON.stringify(cabin));



  res.render('test', { 
    title: 'test', 
    aCamper : camper, 
    aRec : rec, 
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

  camperDude.save( function(err) {
    if (err) { throw err; }
    console.log('Camper saved');
  });
  res.render('addCamper', { 
    title : 'Add Camper', 
    cabins : (new CamperModel()).schema.path('cabin').enumValues,
  });
};

exports.addRec = function(req, res) {
  res.render('addRec', {
    title : 'Add Rec',
    recBlocks : (new RecModel()).schema.path('recBlock').enumValues,
  });
};

exports.addingRec = function(req, res) {
  var recName = req.param('name');
  var recCapacity = req.param('capacity');
  var recRecBlock = req.param('recBlock');

  var rec = new RecModel();
  rec.name = recName;
  rec.capacity = recCapacity;
  rec.recBlock = recRecBlock;

  rec.save( function(err) {
    if (err) { throw err; }
    console.log('Rec saved');
  });
  res.render('addRec', {
    title : 'Add Rec',
    recBlocks : (new RecModel()).schema.path('recBlock').enumValues,
  });
};

exports.assign = function(req, res) {
  // Get the Campers
  CamperModel.find().select('name cabin').exec(function(err) {
    if (err) { throw err; }

    var campersByCabin = getCampersByCabin(this);

    // Get the recs
    RecModel.find().select('name recBlock').exec(function(err) {
      if (err) { throw err; }
    
      var recsByRecBlock = getRecsByRecBlock(this);

      // Render the page
      res.render('assign', {
        title : 'Assign Recs',
        recBlocks : (new RecModel()).schema.path('recBlock').enumValues,
        cabins : (new CamperModel()).schema.path('cabin').enumValues,
        campers : campersByCabin,
        recs : recsByRecBlock,
      });
    });
  });
};




var getCampersByCabin = function(resultOfQuery) {
  var people = resultOfQuery['emitted']['complete'][0];
  var campersByCabin = {};
  var cabins = (new CamperModel()).schema.path('cabin').enumValues;

  for(var i = 0; i < cabins.length; i++)
  {
    campersByCabin[cabins[i]] = new Array();
  }

  for(var i = 0; i < people.length; i++)
  {
    var firstName = people[i]['name'][0]['firstName'];
    var lastName = people[i]['name'][0]['lastName'];
    var name = firstName + ' ' + lastName;
    var cabin = people[i]['cabin'];
    campersByCabin[cabin].push(name);
  }
  return campersByCabin;
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
