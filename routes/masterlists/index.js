var express = require('express');
var app = module.exports = express();

var mongoose = require('mongoose');
var User = require('../user.model.js');
var MasterList = require('../masterlist.model.js');

app.post('/done', function(req, res){
	console.log(req.body);
	console.log(req.session.user._id);
	res.send('405');
})

app.get('/all', function( req, res){
	MasterList.find({}, function(err, results){
		res.json(results);
	});
})

app.post('/new', function(req, res) {
	var title = req.body.title;
	var tasks = req.body.tasks.split(',');
		
	var todos = [];
	for(var i = 0; i < tasks.length; i++ ){
		var masterListItem = {
			description: tasks[i],
			doneUsers: []
		};
		todos.push(masterListItem);
	}
	var masterList = new MasterList({title: title, todos: todos });
	masterList.save(function (err, masterList) {
	if (err){
		console.log(err);
	} else {
		res.send('success');
	}
	});
});

	
//subscribes user to list
app.post('/subscribe', function(req, res) {
	var masterListId = req.body.id;
    ensureAuthenticated(req, res, function(user){
		
	User.count({_id: user._id, 'lists.associatedMasterList': masterListId},function(err, count){
		if(err){
			console.log(err);
		}
		if(count == 0){
			createLocalList(masterListId, function(localList){
				User.findByIdAndUpdate(
					user._id,
					{$push: {lists:localList}},
					function(err, user) {
						if(err)
							console.log(err);
						else
							res.send("success");
					}
				);
			});
			} else {
				res.send("duplicate");
			}
	});
		
		
		
	});
});


function createLocalList(masterListId, done){
	MasterList.find({_id: masterListId},function(err, results){
		if(err){
			console.log(err);
		}  
		var masterList = results[0];
		console.log(masterList + "-------");
		var listItems = createLocalListItems(masterList.todos);
		
		var localList = {
			associatedMasterList: masterListId,
			title: masterList.title,
			todos: listItems
		};
		done(localList);
	});
}

function createLocalListItems(masterListItems){
	var localListItems = [];
	for(var i = 0; i < masterListItems.length; i++){
		var masterListItem = masterListItems[i];
		var localListItem = {
				description: masterListItem.description,
				completed: false,
				dueDate: masterListItem.dueDate
		};
		localListItems.push(localListItem);
	}
	return localListItems;
}

function ensureAuthenticated(req, res, next) {
  if (req.session.user) { 
	  console.log("user:" + req.session.user._id);
	  next(req.session.user); 
  } else {
	res.redirect('/login.html');
  }
}