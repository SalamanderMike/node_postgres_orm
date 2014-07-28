var db = require('./db');

function Person(params) {
  this.firstname = params.firstname;
  this.lastname = params.lastname;
  this.id = params.id;
};


Person.all = function(callback){ // callback = function from app.js
  db.query("SELECT * FROM people;",[], function(err, res){
    var allTheLonelyPeople = [];// Create an array
    if (!err){// if no error, do...
      res.rows.forEach(function(individual){        // Read each row and do...
        allTheLonelyPeople.push(new Person(individual));// array.push(the Person)
      });
    } else {
      console.log('Ack!!!');
    };
    callback(err, allTheLonelyPeople);// Now, do function from app.js
  });                              // and pass back the value of 
};                                 // allTheLonelyPeople

Person.findBy = function(surname, callback) {// callback = function from app.js
  db.query("SELECT * FROM people WHERE lastname = $1;",[surname], function(err, res){
    if (res.rows[0] !== undefined){
      foundPerson = [res.rows[0]];
    } else {
      foundPerson = false;
    }
    callback(err, foundPerson);// Now, do function from app.js
  });                              // and pass back the value of 
};                                 // foundPerson

Person.create = function(params, callback){
  db.query("INSERT INTO people (firstname, lastname) VALUES ($1, $2) RETURNING *", [params.firstname, params.lastname], function(err, res){
    callback();
  });
};

Person.prototype.update = function(params, callback) {
  console.log(params.id);
  var colNames = [];
  var colVals = [];
  var count = 2; // start at firstname... $2...

  for(var key in params) {// ...creating statement of key:value pairs for SQL
    if(params.hasOwnProperty(key) && params[key] !== undefined){
      var colName = key + "=$" + count;
      colNames.push(colName);
      colVals.push(params[key]);
      count++;
    };
  }
// Putting the statement together: UPDATE... id, firstname, lastname...
  var statement = "UPDATE people SET " + colNames.join(", ") + " WHERE id=$1 RETURNING *";
  var values = [params.id].concat(colVals);// [1,Bob,Brown,1]

  console.log("Running:");
  console.log(statement, "with values", values);
  var _this = params;

// Calling the statement
  db.query(statement, values, function(err, res) {
    var updatedRow;
    if(!err) {
      updatedRow = res.rows[0];
      _this.firstname = updatedRow.firstname;
      _this.lastname = updatedRow.lastname;
    } else {
      console.error("OOP! Something went wrong!", err);
    }
    callback(err, _this)
  });
};

Person.prototype.destroy = function(id, callback){
  db.query("DELETE FROM people WHERE id = $1", [id], function(err, res) {
    callback(err)
  });
};

module.exports = Person;
