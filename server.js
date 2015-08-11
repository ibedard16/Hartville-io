"use strict";
var fs = require('fs'),
    express = require('express'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    post = require('./post');

var app = express();
    app.set('port', process.env.PORT || 8000);
    app.use(express.static(path.join(__dirname + '/public')));
    app.set('views', __dirname + "/public");
    app.set('view engine', 'html');

app.get("/posts.json", function(request, response) {
    post.find(function(err, posts) {
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

app.get('/', function(request, response) {
    response.send('index.html');
})

app.get('/index.html', function(request, response) {
    response.send('index.html');
})

/*app.get('*', function(request, response) {
    response.sendFile(__dirname + '/public/index.html#/404');
})*/

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});