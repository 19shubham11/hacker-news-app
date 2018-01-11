var mongoose = require('mongoose');


var schema = new mongoose.Schema({
	author : String,
	comment_text: String,
	created_at : String,
	num_comments : Number,
	objectID : Number,
	points : Number,
	title : String,
	url : String
});

var allTimeTop = module.exports = mongoose.model('allTimeTop', schema);
var searchStories = module.exports = mongoose.model('searchStories', schema);
var topStories = module.exports = mongoose.model('topStories', schema);
var last24hrs = module.exports = mongoose.model('last24hrs',schema);