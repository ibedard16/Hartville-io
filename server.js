"use strict";
var express     = require('express'),
    fs          = require('fs'),
    path        = require('path'),
    http        = require('http'),
    auth        = require('./server/routes/auth'),
    _           = require('lodash'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    OAuth       = require('./server/routes/OAuth'),
    sitemap     = require('./server/routes/sitemap'),
    sass        = require('node-sass'),
    resources   = require('./server/routes/resources'),
    minifyJavascript = require('./server/helpers/minifyJavascript');
    
try {
    var config = require('./server/config');
    mongoose.connect(config.DATABASE_URL);
} catch (e) {
    mongoose.connect('mongodb://PostReader:PostReader@ds059672.mongolab.com:59672/hartvilleio');
    console.log('Server was not able to log in to database.');
}

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
    
    app.use('*', function (req,res,next) {
        res.notify = function (messageType, messageBody, messageTitle) {
            res.send({notification: {type:messageType,body:messageBody,title:messageTitle}});
        };
        next();
    });
    
    var css;
    
    function renderSass () {
        var sassString = '';
        for (var color in config.client_config.colors) {
            sassString = sassString + color + ': ' + config.client_config.colors[color] + '; ';
        }
        if (sassString === '') {
            sassString = "\
                $colorBrand: #DB3A0D; \
                $colorBrandLight: #E67556; \
                $colorBrandDark: #AF2E0A; \
                $colorAccent: #EF8813; \
                $colorAccentLight: #F5B871; \
                $colorAccentDark: #78440A;";
        }
        sassString = sassString + "@import 'styles';";
        
        var result = sass.renderSync({
            data: sassString,
            includePaths: ['public/sass']
        });
                
        css = result.css.toString('utf8');
    }
    
    renderSass();
    
    app.use('/css', function (req, res) {
        res.set({'content-type': 'text/css'}).send(css);
    });
    app.use('/images', express.static(path.join(__dirname + '/public/images')));
    app.use('/js', express.static(path.join(__dirname + '/public/js')));
    app.use('/vendor', express.static(path.join(__dirname + '/public/vendor')));
    app.use('/views', express.static(path.join(__dirname + '/public/views')));
    app.use('/postFiles', express.static(path.join(__dirname + '/public/postFiles')));
    app.get("/favicon.ico", function (req,res) {
        res.sendFile(__dirname + '/public/favicon.ico');
    });
    app.get("/robots.txt", function (req,res) {
        fs.readFile(__dirname + '/public/robots.txt', 'utf8', function (err, data) {
            if (err) {
                return res.send(err);
            }
            data = data + "\rSitemap: " + config.APP_URL + "sitemap.txt";
            res.set('content-type', 'text/plain').send(data);
        });
    });
    
    app.get("/app.min.js", function (req, res) {
        res.sendFile(__dirname + '/public/app.min.js');
    });
    
    app.use('/resources', resources);
    
    app.use('/auth', auth);
    
    app.use('/OAuth', OAuth);
    
    app.use('/sitemap.txt', sitemap);

app.get("/google*", function (request, response) {
    var verifyUrl = request.url.substring(7);
    console.log("A user or a GoogleBot attempted to verify the website at: google" + verifyUrl);
    response.sendFile(__dirname + '/server/verification/google' + verifyUrl);
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

http.createServer(app).listen(app.get('port'), app.get('IP'), function() {
    console.log('Server listening on port ' + app.get('port'));
    minifyJavascript();
});