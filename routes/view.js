var schemas = require('./schemas');
var Camper = schemas.Camper;
var Rec = schemas.Rec;
var getStuff = require('./getStuff');

exports.attendance = function(req, res) {
  Rec.find({'week':req.param('week')}).select('name people recBlock').exec(function (err) {
    var campersByRec = getStuff.getCampersByRec(this);

    res.render('attendance', {
      title : 'Attendance',
      campers : campersByRec,
    });
  });
};

exports.cabinList = function(req, res) {
  Camper.find().exec(function (err) {
    if (err) { throw err; }
    var campersByCabin = getStuff.getCampersByCabin(this);
    console.log(JSON.stringify(campersByCabin));

    res.render('cabinList', {
      title : 'Cabin Lists',
      campersByCabin : campersByCabin,
    });
  });
};


