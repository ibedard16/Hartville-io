var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:wzgk1212@ds059672.mongolab.com:59672/hartvilleio');

var postSchema = mongoose.Schema({
    title:      String,
    author:     String,
    date:       { type: Date, default: Date.now },
    content:    String,
    categories: Array,
    images:     Array
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;