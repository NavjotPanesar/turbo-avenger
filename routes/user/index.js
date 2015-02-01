var express = require('express');
var app = module.exports = express();

var mongoose = require('mongoose');
var User = require('../user.model.js');

app.get('/', function(req, res) {
	ensureAuthenticated(req, res, function(user){
		var id = user._id;
		User.find({_id: id},function(err, results){
			for (var i = 0; i < results.length; i++) {
				res.json(results[i]);
			}
		});
	});
});

app.get('/lists', function(req, res) {
	ensureAuthenticated(req, res, function(user){
		var id = user._id;
		User.find({_id: id},function(err, results){
			for (var i = 0; i < results.length; i++) {
				res.json(results[i].lists);
			}
		});
	});
});

function ensureAuthenticated(req, res, next) {
  if (req.session.user) { 
	  console.log("user:" + req.session.user._id);
	  next(req.session.user); 
  } else {
	res.redirect('/login.html');
  }
}