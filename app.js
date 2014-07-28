var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  pg = require('pg'),
  Person = require('./models/main.js').Person,
  app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public')); // get static file: CSS
// Middleware
app.use(bodyParser.urlencoded());
app.use(methodOverride("_method"));

app.get('/', function (req, res) {
  res.redirect('/people');
});

// **** BONUS: Static Constructor under construction *****
var Record = function(params){
  this.params = params;

  this.findMe = Person.findBy(this.params, function (err, foundPerson){
    if (foundPerson) {
      res.render("people/show", {people: foundPerson});
    } else {
      res.render("people/error");
    };
  });
}

// Site Pages
app.get("/people", function(req, res){
  Person.all(function (err, allLovelyPeople){ // Person.all(this is the callback)
    res.render("people/index", {people: allLovelyPeople}) // people = allLovelyPeople
  });
});

app.get("/people/find", function(req, res){
  res.render('people/find');
});

app.get("/people/new", function(req, res){
  res.render("people/new");
});



// Calc Engine: FIND person
app.post("/people/find", function(req, res){
  var val = req.body.person.lastname;
  Person.findBy(val, function (err, foundPerson){
    if (foundPerson) {
      res.render("people/show", {people: foundPerson});
    } else {
      res.render("people/error");
    };
  });
});

// // Constructor FIND ***** Under Construction *****
// app.post("/people/find", function(req, res){
//   var val = req.body.person.lastname;
//   var findPerson = new Record(val);

//   findPerson.findMe();
// });


// Calc Engine: NEW person
app.post("/people/new", function(req, res){
  var params = req.body.person;
  Person.create(params, function (err){
    res.redirect("/people");
  });
});

// DELETE
app.delete("/people/delete", function(req, res){
  var id = req.body.person.id;
  Person.prototype.destroy(id, function (err){
    res.redirect("/people");
  });
});

// UPDATE
app.put("/people/update", function(req,res){
  var params = req.body.person;
  Person.prototype.update(params, function (err){
    res.redirect("/people");
  });
});




app.listen(3000, function(){
  console.log("NODEMON RIDING IN THE CODE-VAN localhost:3000");
});
