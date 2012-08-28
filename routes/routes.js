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
