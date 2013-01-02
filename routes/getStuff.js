var schemas = require('./schemas');
var Camper = schemas.Camper;
var Rec = schemas.Rec;
var Person = schemas.Person;


var getCampersByCabin = function(resultOfQuery) {
  var people = resultOfQuery['emitted']['complete'][0];
  var campersByCabin = {
      campers : {},
      names : {},
    };
  var cabins = (new Camper()).schema.path('cabin').enumValues;

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

var getRecsByRecBlock = function(resultOfQuery) {
  var recs = resultOfQuery['emitted']['complete'][0];
  console.log('recs = ' + recs);
  var recsByRecBlock = {};
  var recBlocks= (new Rec()).schema.path('recBlock').enumValues;
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

module.exports = {
  getCampersByRec : getCampersByRec,
  getCampersByCabin : getCampersByCabin,
  getRecsByRecBlock : getRecsByRecBlock,
}
