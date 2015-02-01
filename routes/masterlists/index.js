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

/*app.get('/', function(req, res) {
	var title = "Test master list";
	var todoItemDescriptions = ("Do stuff, do more stuff, do many things").split(',');
	
	var todos = [];
	for(var i = 0; i < todoItemDescriptions.length; i++ ){
		var masterListItem = new MasterListItem({
			description: todoItemDescriptions[i],
			users: []
		});
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
});*/

	
//should be post
app.get('/:id', function(req, res) {
	var masterListId = req.params.id;
    ensureAuthenticated(req, res, function(user){
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
				completed: false
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