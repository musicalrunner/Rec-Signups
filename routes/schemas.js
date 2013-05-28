// mongoose stuff

var mongoose = require('mongoose');

var connect = function(url) {
  mongoose.connect(url);
};

var Schema = mongoose.Schema;

// Schemas
//
// Validation 
// (enums)

var recBlocks = 'first second double'.split(' ');
var cabins = 'Dorr.Smith.Sault.Burns.Towne.Wade.Up Dorm.Down Dorm'.split('.');

// (functions)

var validateNoScheduleConflict = function(recs) {
  // There is no conflict if there are no recs
  if(recs.length === 0) {
    return true;
  }
  else {
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
  }
};

/*
 * The parameter <recs> is the rec mongoose object /before/ the
 * new camper has been added.
 * NOTE: this is not a mongoose validation function
 * since sometimes we need to override.
 */
var validateCapacity = function(rec) {
  console.log('validating capacity');
  console.log('rec = ' + JSON.stringify(rec));
  if(rec.people.length + 1 > rec.capacity) {
    return false;
  }
  else {
    return true;
  }
}

var PersonSchema = new Schema( {
  firstName : String,
  lastName : String,
});

var RecSchema = new Schema( {
  name : String,
  capacity : Number,
  week : Number,
  recBlock : { type : String, enum : recBlocks },
  people : [PersonSchema],
});

var CamperSchema = new Schema( {
  name : [PersonSchema],
  recs : [RecSchema],
  cabin : { type : String, enum : cabins},
});


// Models

var Person = mongoose.model('Person', PersonSchema);
var Rec = mongoose.model('Rec', RecSchema);
var Camper = mongoose.model('Camper', CamperSchema);
//
// Apply validation

Camper.schema.path('recs').validate(validateNoScheduleConflict, 'Schedule Conflict');


module.exports = {
  Person : Person,
  Rec : Rec,
  Camper : Camper,
  validateCapacity : validateCapacity,
  connect : connect,
};
