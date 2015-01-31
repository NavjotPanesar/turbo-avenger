var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
  googleId: String
});
