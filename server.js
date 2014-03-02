// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

//var configDB = require('./config/database.js');

// load up the user model


// configuration ===============================================================
mongoose.connect('mongodb://root:root@novus.modulusmongo.net:27017/qy7nyXog'); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'bhsf972929nbkdsajvn8332498720243bkv' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});


var Schema = new mongoose.Schema({
	id : Number,
	name : String,
	email: String,
	reason : String,
	dateTime: Date
});

var userActivity = mongoose.model('empActivity',Schema);
/*
app.post('/new',function(req,res){
	new user({
		id: req.body.empID,
		name : req.body.name,
		reason : req.body.reason
	}).save(function(err, doc){
			if(err) {
			console.log(err);
			res.end("There is some system error");
			}
			else res.redirect("https://www.google.com");
	});
});
*/

app.post('/new',function(req,res){
	
	var user            = req.user;
	
	user.local.email    = req.user.local.email;
	user.local.password    = req.user.local.password;

	user.local.id       = req.body.empID;
	user.local.fullName    = req.body.name;
	user.local.reason    = req.body.reason;
	user.local.dateLastVisit = new Date();
	
	new userActivity({
		id      : req.body.empID,
		name    : req.body.name,
		email   : req.user.local.email,
		reason  : req.body.reason,
		dateTime : new Date()
		
	}).save(function(err, doc){
			if(err) {
			console.log(err);
			res.end("There is some system error");
			}
			else {
				console.log("Successful" + doc);
				console.log(new Date());
				}
				
	});
	
	user.save(function(err) {
		if(err) {
			console.log(err);
		}
		else {
			req.logout();
			res.redirect('https://www.google.com');
			}
		});
		
	
	
	
});


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
