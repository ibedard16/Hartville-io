"use strict";
var fs = require('fs'),
    express = require('express'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    bodyParser = require('body-parser'),
    Post = require('./server/database/postSchema');
    
try {
    var mongoConnect = require('./server/database/databaseConnect');
} catch (e) {
    var readerConnect = require('./server/database/readerConnect');
}
    
var app = express();
    app.set('port', process.env.PORT || 8000);
    app.set('IP', process.env.IP || '127.0.0.1');
    app.use('/css', express.static(path.join(__dirname + '/public/css')));
    app.use('/images', express.static(path.join(__dirname + '/public/images')));
    app.use('/js', express.static(path.join(__dirname + '/public/js')));
    app.use('/vendor', express.static(path.join(__dirname + '/public/vendor')));
    app.use('/views', express.static(path.join(__dirname + '/public/views')));
    app.use(bodyParser.urlencoded({ extended: false }));
    
app.get("/favicon.ico", function(request, response){
    response.sendFile(__dirname + '/public/favicon.ico');
});

app.get("/posts.json", function(request, response) {
    Post.find(function(err, posts) {
        if (err) {
            response.status(500).send({
                success:false
            });
        }
        else {
            response.send({
                success:true,
                posts:posts
            });
        }
    });
});

app.get("/google*", function(request, response) {
    var verifyUrl = request.url.substring(7);
    console.log("A user or a GoogleBot attempted to verify the website at: google" + verifyUrl);
    response.sendFile(__dirname + '/server/verification/google' + verifyUrl);
});

app.post('/create', function(request, response) {
    if (request.body.password === 'password') {
        var post = new Post({
            title: request.body.title,
            author: request.body.username,
            content: request.body.content,
            categories: request.body.categories,
            images: ""
        });
        
        post.save(function(err, model) {
            if (err) {
                response.status(500).send(err);
            }
            else {
                response.redirect('/');
            }
        });
    } else {
        response.status(401).send('Invalid Password');
    }
});

app.get('*', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

http.createServer(app).listen(app.get('port'), app.get('IP'), function() {
    console.log('Server listening on port ' + app.get('port'));
});