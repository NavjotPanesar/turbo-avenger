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

app.get('/leaderboard', function(req, res){
	ensureAuthenticated(req, res, function(user){
		User.find({}, '-lists -_id').sort({'points': -1}).exec(function(err,results) {
			if(err)
					console.log(err);
			res.json(results);
		});
	})
})

app.post('/toggle', function(req, res){
	var userID = req.session.user._id;
	var listId = req.body.listId;
	var desc = req.body.description;
	console.log(listId);
	
	var query = User.where({_id:userID});
	query.findOne(function(err, user){
		if(err) console.log(err);
		if(user){
			for(var i = 0; i < user.lists.length; i++){
				if(user.lists[i].associatedMasterList == listId){
					for(var j = 0; j < user.lists[i].todos.length; j++){
						if(user.lists[i].todos[j].description == desc){
							var newTodoValue = user.lists[i].todos[j].completed = !user.lists[i].todos[j].completed;
							var dueDate = user.lists[i].todos[j].dueData;
							var currentDate = new Date();
							var timeDifference = dueDate > currentDate ?(dueDate - currentDate) : 0;
							var days = timeDifference/ (1000 * 60 *60 * 24);
							var oldPoints = (user.points) ? user.points : 0;
							var newPoints = 1 + (days * 2);
							var finalPoints = oldPoints;
							if(newTodoValue == true){
								 finalPoints += newPoints;
							} else {
								finalPoints -= newPoints;
								finalPoints = finalPoints > 0 ? finalPoints : 0;
							}
							console.log('old ' + oldPoints);
							console.log('new ' + newPoints);

							
							User.update({ _id: userID}, {lists : user.lists, points: finalPoints}, function(err, numChanged){
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

