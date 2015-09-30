var mongoose = require('mongoose');

var authorSchema = mongoose.Schema({
    name:   String,
    title:  String,
    bio:    String,
    about:  String,
    avatar: String,
    contact:    {
                    email: String,
                    website: String,
                    facebook: String,
                }
});

var Author = mongoose.model('Author', authorSchema);

/*var author = new Author({
    name:   'ibedard16',
    bio:    "A developer for Hartville.io who came on rather late in development. He doesn't do much except sit around all day and eat food. We're not sure why he's still here.",
    avatar: "images/theFaceOfHartville.jpg"
});

var author = new Author({
    name:   'Brent',
    title:  'Web Developer',
    bio:    "I like front-end web development.",
    about:  "Student at Stark State College studying Web Design & Development. I really like front-end web development.",
    avatar: "images/bmor-creative.jpg",
    contact: {
        email:      'brentwmiller93@gmail.com',
        website:    'bmor-creative.com',
        facebook:   'facebook.com/bmorcreative'
    }
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