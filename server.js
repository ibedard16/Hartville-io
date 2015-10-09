"use strict";
var express             = require('express'),
    path                = require('path'),
    http                = require('http'),
    auth                = require('./server/routes/auth'),
    _                   = require('lodash'),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    OAuth       = require('./server/routes/OAuth'),
    sass        = require('node-sass-middleware'),
    resources   = require('./server/routes/resources');

    var app = express();
    
    app.set('port', process.env.PORT || 8000);
    app.set('IP', process.env.IP || '127.0.0.1');
    
    app.use(bodyParser.json({limit: '3mb'}));
    
    app.use(function (request, response, next) {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        next();
    });
    
    app.use('/css', sass({
        src: path.join(__dirname + '/public/sass'),
        dest: path.join(__dirname + '/public/css'),
        debug: false,
        outputStyle: 'compressed',
        
        error: function(err) {console.log(err);}
      }));
    app.use('/css', express.static(path.join(__dirname + '/public/css')));
    app.use('/images', express.static(path.join(__dirname + '/public/images')));
    app.use('/js', express.static(path.join(__dirname + '/public/js')));
    app.use('/vendor', express.static(path.join(__dirname + '/public/vendor')));
    app.use('/views', express.static(path.join(__dirname + '/public/views')));
    app.use('/postFiles', express.static(path.join(__dirname + '/public/postFiles')));
    app.get("/favicon.ico", express.static(path.join(__dirname + '/public/favicon.ico')));
    
    app.use('/resources', resources);
    
    app.use('/auth', auth);
    
    app.use('/OAuth', OAuth);
    
try {
    var config = require('./server/config');
    mongoose.connect(config.DATABASE_URL);
} catch (e) {
    mongoose.connect('mongodb://PostReader:PostReader@ds059672.mongolab.com:59672/hartvilleio');
    console.log('Server was not able to log in to database.');
}

app.get("/google*", function (request, response) {
    var verifyUrl = request.url.substring(7);
    console.log("A user or a GoogleBot attempted to verify the website at: google" + verifyUrl);
    response.sendFile(__dirname + '/server/verification/google' + verifyUrl);
});

app.get('*', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

http.createServer(app).listen(app.get('port'), app.get('IP'), function() {
    console.log('Server listening on port ' + app.get('port'));
});