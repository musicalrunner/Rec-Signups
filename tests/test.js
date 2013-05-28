var schemas = require('../routes/schemas')
var Person = schemas.Person;
var Rec = schemas.Rec;
var Camper = schemas.Camper;
var validateCapacity = schemas.validateCapacity;

var CamperGroup = function() {
  this.person = new Person();
  this.person.firstName = 'Sam';
  this.person.lastName - 'Kohn';

  this.rec = new Rec();
  this.rec.name = 'Phys Fit';
  this.rec.capacity = 1;
  this.rec.recBlock = 'first';
  this.rec.week = 1;

  this.camper = new Camper();
  this.camper.name.push(this.person);
  this.camper.cabin = 'Dorr';

  this.camper.recs.push(this.rec);
};

exports.testValidateCapacity = function(test) {
  test.expect(2);

  var group = new CamperGroup();

  var underCapacity = validateCapacity(group.rec);



  test.ok(underCapacity, "passes if rec is not full");

  group.rec.capacity = 0;
  underCapacity = validateCapacity(group.rec);

  test.ok(!underCapacity, "passes if rec is full");
  test.done();
};

