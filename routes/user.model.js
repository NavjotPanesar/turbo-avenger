var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var UserSchema = new Schema({
	_id: String,
	name: String,
	imageUrl: String,
	points: Number,
	lists: [{
		associatedMasterList: String,
		title: String,
		todos: [{
			dueDate: Date, 
			description: String,
			completed: Boolean
		}]   
	}]  
});
UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);