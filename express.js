"use strict";
var fs = require('fs'),
    express = require('express'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    post = require('./post');

var app = express();
    app.set('port', process.env.PORT || 8000);
    app.use(express.static(path.join(__dirname)));

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

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});