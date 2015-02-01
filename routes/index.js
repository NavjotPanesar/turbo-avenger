var express = require('express');
var app = module.exports = express();

var auth = require('./auth/');
app.use('/auth', auth);

var users = require('./users/');
app.use('/users', users);

var masterlists = require('./masterlists/');
app.use('/masterlists', masterlists);

/* GET list of api routes */
app.get('/', function(req, res) {
	ensureAuthenticated(req, res, function(){
		res.redirect('/main.html');
	});
});

function ensureAuthenticated(req, res, next) {
  if (req.session.user) { 
	  console.log("user:" + req.session.user.googleId);
	  next(); 
  } else {
	res.redirect('/login.html');
  }
}