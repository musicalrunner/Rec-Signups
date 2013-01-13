var schemas = require('./schemas');
var PDF = require('pdfkit');
var Camper = schemas.Camper;
var Rec = schemas.Rec;
var getStuff = require('./getStuff');

// View attendance sheets
exports.attendance = function(req, res) {
  
  // get the week
  var week = req.param('week');

  // make a new document
  var doc = new PDF();

  // Retrieve all the recs from this week
  Rec.find({'week':req.param('week')}).select('name people recBlock').exec(function (err) {
    
    // create an object with all the relevant info in it
    var campersByRec = getStuff.getCampersByRec(this);

    // don't need to add a page the first time because PDFkit automatically
    // does so when you create a doc. don't know how to delete a page or
    // disable this functionality
    var needToAddPage = false;

    // loop for each rec and each recblock 
    for(recName in campersByRec) {
      for(recBlock in campersByRec[recName]) {

        // do the addPage handling
        if(!needToAddPage) {
          needToAddPage = true;
        }
        else {
          doc.addPage();
        }

        // add the header to the page
        doc.fontSize(25);
        doc.text(recName + ' (' + recBlock + ' rec), week ' + week);

        // reset the font size
        doc.fontSize(12);


        var dayOfWeekX = 250;
        var dayOfWeekXskip = 50;
        var dayOfWeekY = 120;
        var yMin = 750;
        var vertLineSpacing = dayOfWeekXskip / 2.0;

        // draw first vertical line
        doc.moveTo(dayOfWeekX - vertLineSpacing, dayOfWeekY);
        doc.lineTo(dayOfWeekX - vertLineSpacing, yMin);

        // draw days of the week and vertical lines
        ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach( function(day) {
          doc.text(day, dayOfWeekX, dayOfWeekY);
          // draw vertical line
          doc.moveTo(dayOfWeekX + vertLineSpacing, dayOfWeekY);
          doc.lineTo(dayOfWeekX + vertLineSpacing, yMin);
          dayOfWeekX += dayOfWeekXskip;
        });


        //
        // variables for adding the campers to a list
        var lineNum = 1;
        var yStart = 150;
        var xStart = 60;
        var xEnd = 500;
        var deltaY = 30;
        var horizLineSpacing = deltaY / 2.0;
          
        doc.moveTo(xStart, yStart - horizLineSpacing);
        doc.lineTo(xEnd, yStart - horizLineSpacing);
        doc.stroke();

        campersByRec[recName][recBlock].forEach( function(name, index) {
          doc.text(lineNum + '. ' + name, xStart, yStart);

          // Draw line
          doc.moveTo(xStart, yStart + horizLineSpacing);
          doc.lineTo(xEnd, yStart + horizLineSpacing);
          doc.stroke();
          lineNum++;
          yStart += deltaY;
        });

      }
    }
    doc.output(function(out) {
      res.type('application/pdf');
      res.end(out, 'binary');
    });
/*
    res.render('attendance', {
      title : 'Attendance',
      campers : campersByRec,
      */
  });
};

exports.cabinList = function(req, res) {
  
  // get the week
  /* // put all weeks in so no need to specify
   var week = req.param('week');
   */

  // make a new document
  var doc = new PDF();

  // retrieve all of the campers
  Camper.find().sort({name : 1}).exec(function (err) {
    if (err) { throw err; }
    var campersByCabin = getStuff.getCampersByCabin(this);
    console.log(JSON.stringify(campersByCabin));

    // don't need to add a page the first time because PDFkit automatically
    // does so when you create a doc. don't know how to delete a page or
    // disable this functionality
    var needToAddPage = false;

    for (cabin in campersByCabin['campers']) {
      
      // do the addPage handling
      if(!needToAddPage) {
        needToAddPage = true;
      }
      else {
        doc.addPage();
      }

      doc.fontSize(25);
      doc.text(cabin);
      
      // Week labels

        
      // variables for adding the campers to a list
      var lineNum = 1;
      var yPos = 150;
      var bigLineHeight = 40;
      var smallLineHeight = 20;
      var rectYoffset = 5;
      var nameXPos = 80;

      doc.fontSize(12);

      campersByCabin['campers'][cabin].forEach( function(camper, index) {
        
        // position variales
        var xInitPos = 200;
        var xSkip = 100;

        // draw a grey rectangle to help split up first and second recs
        doc.fillColor('#DEDEDE');
        doc.rect(nameXPos, yPos - rectYoffset, 470, smallLineHeight);
        doc.fill();
        doc.stroke();
        doc.fillColor('black');

        var name = campersByCabin['names'][cabin][index];
        doc.text(name, nameXPos, yPos);

        // Find this week's recs
        camper.recs.forEach( function(rec) {
          var week = rec.week - 1;
          if(rec.recBlock === 'first') {
            console.log('rec: ' + rec.name);
            doc.text(rec.name, xInitPos + week * xSkip, yPos);
          }
          else if(rec.recBlock === 'second') {
            doc.text(rec.name, xInitPos + week * xSkip, yPos + smallLineHeight);
          }
          else if(rec.recBlock === 'double') {
            doc.text(rec.name, xInitPos + week * xSkip, yPos);
            doc.text(rec.name, xInitPos + week * xSkip, yPos + smallLineHeight);
          }
          else {
            throw {
              message : 'Invalid recBlock for rec' + rec.name,
            }
          }
        });

        lineNum++;
        yPos += bigLineHeight;
      });

    }



    doc.output(function(out) {
      res.type('application/pdf');
      res.end(out, 'binary');
    });
    /*
    res.render('cabinList', {
      title : 'Cabin Lists',
      campersByCabin : campersByCabin,
    });
    */
  });
};


