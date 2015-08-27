var mongoose = require('mongoose');

var authorSchema = mongoose.Schema({
    name:   String,
    bio:    String,
    avatar: String
});

var Author = mongoose.model('Author', authorSchema);

/*var author = new Author({
    name:   'ibedard16',
    bio:    "A developer for Hartville.io who came on rather late in development. He doesn't do much except sit around all day and eat food. We're not sure why he's still here.",
    avatar: "images/theFaceOfHartville.jpg"
});

var author = new Author({
    name:   'Brent',
    bio:    "I like front-end design.",
    avatar: "images/bmor-creative.png"
});

author.save(function(err, model) {
    if (err) {
        console.log('An error happened and the author was not saved to the database.');
    }
    else {
        console.log('The author appears to have been successfully recorded to the database.');
    }
});*/

module.exports = Author;