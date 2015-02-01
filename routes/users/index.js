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

app.post('/toggle', function(req, res){
	var userID = req.session.user._id;
	var listId = req.body.listId;
	var desc = req.body.description;
	
	var query = User.where({_id:userID});
	query.findOne(function(err, user){
		if(err) console.log(err);
		if(user){
			for(var i = 0; i < user.lists.length; i++){
				if(user.lists[i].associatedMasterList == listId){
					for(var j = 0; j < user.lists[i].todos.length; j++){
						if(user.lists[i].todos[j].description == desc){
							user.lists[i].todos[j].completed = !user.lists[i].todos[j].completed;
							User.update({ _id: userID}, {lists : user.lists}, function(err, numChanged){
								if(err)
									console.log(err);
								console.log("num changed: " + numChanged);
							});
							res.send(123);
						}
					}
				}
				
			}
			res.send(0);
		}
	})
	
})