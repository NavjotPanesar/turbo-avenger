var mongoose = require('mongoose');

module.exports = mongoose.model('MasterList',{
	title: String,
	todos: [{
		description: String,
		doneUsers: [{userIds: String}] //users that are done this specific task
		}]   
});
