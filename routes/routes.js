// mongoose stuff

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/recsignups');
var Schema = mongoose.Schema;

// Schemas

var Person = new Schema( {
  firstName : String,
  lastName : String,
});

var Rec = new Schema( {
  name : String,
  capacity : Number,
  recBlock : String,
  people : [Person],
});

var Camper = new Schema( {
  name : {type : Schema.Types.ObjectId, ref : 'Person'},
  recs : [Rec],
});

// Models

var PersonModel = mongoose.model('Person', Person);
var RecModel = mongoose.model('Rec', Rec);
var CamperModel = mongoose.model('Camper', Camper);

/*
 * GET home page.
 */

exports.index = function(req, res){

  var dude = new PersonModel();
  dude.firstName = 'Sam';
  dude.lastName = 'Kohn';

  var rec = new RecModel();
  rec.name = 'Phys Fit';
  rec.capacity = 25;
  rec.recBlock = 'First';
  rec.people.push(dude);

  var camper = new CamperModel();
  camper.name = dude;
  camper.recs.push(rec);

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
  console.log('Dude:');
  console.log(JSON.stringify(dude));
  console.log('Rec:');
  console.log(JSON.stringify(rec));
  console.log('Camper:');
  console.log(JSON.stringify(camper));
  */



  res.render('index', { title: 'Express' });
};
