var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var UserSchema = new Schema({
	_id: String,
	lists: [{
		associatedMasterList: String,
		title: String,
		todos: [{
			description: String,
			completed: Boolean
		}]   
	}]  
});
UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);