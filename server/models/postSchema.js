var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    id:         Number,
    title:      String,
    authorId:   String,
    date:       { type: Date, default: Date.now },
    content:    String,
    categories: [String],
    imageHead:  String
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;