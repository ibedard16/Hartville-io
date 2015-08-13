"use strict";
var fs = require('fs'),
    express = require('express'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    Post = require('./post');
    
var app = express();
    app.set('port', process.env.PORT || 8000);
    app.use(express.static(path.join(__dirname + '/public')));
    /*app.set('views', __dirname + "/public");
    app.set('view engine', 'html');*/

app.get("/posts.json", function(request, response) {
    Post.find(function(err, posts) {
        if (err) {
            response.send(500, {
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

app.post('/create', function(request, response) {
    var post = new Post({
        title: request.title,
        author: request.author,
        content: request.content,
        categories: request.categories,
        images: ""
    });
    
    console.log(request);
    console.log(request.author);
    console.log(request.content);
    console.log(request.categories);

    post.save(function(err, model) {
        if (err) {
            response.send(500, 'There was an error - tough luck.');
        }
        else {
            response.redirect('/');
        }
    });
});

/*app.get('/', function(request, response) {
    response.send('index.html');
})

app.get('/index.html', function(request, response) {
    response.send('index.html');
})

app.get('*', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

app.get('/blog', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});*/

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});