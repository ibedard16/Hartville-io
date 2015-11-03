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

postSchema.index({content: "text", title: "text", categories: "text"}, {name: "postIndex", weights: {content: 5, title: 5, categories: 3}});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;