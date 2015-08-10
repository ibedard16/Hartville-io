var mongoose = require('mongoose');

mongoose.connect('mongodb://PostReader:PostReader@ds059672.mongolab.com:59672/hartvilleio');

var postSchema = mongoose.Schema({
    title:      String,
    link:       String,
    author:     String,
    date:       { type: Date, default: Date.now },
    content:    String,
    categories: Array,
    images:     Array
});

var Post = mongoose.model('Post', postSchema);

/*var testpost = new Post({title:"test",link:"doesn'tmatter",author:"John Titor",date:"12345",content:"Content! Content! Content! Content! Content! Content! ",categories:["test"],images:[]});
testpost.save(function (err) {
    if (err) {
        response.send(500,'Too bad, so sad. Whatever you were trying to do didn\'t work!');
    };
});*/
module.exports = Post;