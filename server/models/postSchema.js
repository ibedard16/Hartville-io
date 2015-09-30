var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    id:         Number,
    title:      String,
    author:     String,
    date:       { type: Date, default: Date.now },
    content:    String,
    categories: Array,
    imageHead:  String
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;