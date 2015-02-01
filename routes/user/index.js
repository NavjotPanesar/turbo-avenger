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
							var dueDate = user.lists[i].todos[j].dueData;
							var currentDate = new Date();
							var timeDifference = dueDate > currentDate ?(dueDate - currentDate) : 0;
							var days = timeDifference/ (1000 * 60 *60 * 24);
							var oldPoints = (user.points) ? user.points : 0;
							var newPoints = 1 + (days * 2) + oldPoints;
							User.update({ _id: userID}, {lists : user.lists, points: newPoints}, function(err, numChanged){
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

function ensureAuthenticated(req, res, next) {
  if (req.session.user) { 
	  console.log("user:" + req.session.user._id);
	  next(req.session.user); 
  } else {
	res.redirect('/login.html');
  }
}

