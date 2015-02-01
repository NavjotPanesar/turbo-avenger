var express = require('express');
var app = module.exports = express();

var mongoose = require('mongoose');
var User = require('../user.model.js');

app.get('/', function(req, res) {
    User.find({},function(err, results){
		res.json(results);
	});
});

app.get('/:id/', function(req, res) {
	var id = req.params.id;
	User.find({_id: id},function(err, results){
		for (var i = 0; i < results.length; i++) {
			res.json(results[i]);
		}
	});
});

app.get('/:id/lists', function(req, res) {
	var id = req.params.id;
	User.find({_id: id},function(err, results){
		for (var i = 0; i < results.length; i++) {
			res.json(results[i].lists);
		}
	});
});
