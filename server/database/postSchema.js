var mongoose = require('mongoose');

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