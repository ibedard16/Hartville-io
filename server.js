"use strict";
var express     = require('express'),
    fs          = require('fs'),
    path        = require('path'),
    http        = require('http'),
    auth        = require('./server/routes/auth'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    OAuth       = require('./server/routes/OAuth'),
    sitemap     = require('./server/routes/sitemap'),
    sass        = require('node-sass'),
    lwip        = require('lwip'),
    resources   = require('./server/routes/resources');
    
try {
    var config = require('./server/config');
    mongoose.connect(config.DATABASE_URL);
} catch (e) {
    mongoose.connect('mongodb://PostReader:PostReader@ds059672.mongolab.com:59672/hartvilleio');
    console.log('Server was not able to log in to database.');
}

    var app = express();
    
    app.set('port', process.env.PORT || 80);
    app.set('IP', process.env.IP || '0.0.0.0');
    
    app.use(bodyParser.json({limit: '3mb'}));

    app.use(require('compression')());
    
    app.use(function (request, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
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
            includePaths: ['public/sass'],
            outputStyle: 'compressed'
        });
                
        css = result.css.toString('utf8');
    }
    
    renderSass();
    
    app.use('/css', function (req, res) {
        res.set('Cache-Control', 'max-age=0').set({'content-type': 'text/css'}).send(css);
    });
    app.use('/images', express.static(path.join(__dirname + '/public/images')));
    app.use('/js', express.static(path.join(__dirname + '/public/js')));
    app.use('/vendor', express.static(path.join(__dirname + '/public/vendor')));
    app.use('/views', express.static(path.join(__dirname + '/public/views')));
    app.use('/postFiles', express.static(path.join(__dirname + '/public/postFiles')));
    app.get('/userFiles/avatars/:file', function(req,res) {
        var filetype = req.params.file.slice(-3);
        if (filetype === 'peg') {
            filetype = 'jpg';
        }
        if (req.query.size) {
            req.query.size = Number(req.query.size);
            
            lwip.open(__dirname + '/public/userFiles/avatars/' + req.params.file, function (err, image) {
                if (err) {
                    return res.send(err);
                }
                image.resize(req.query.size, function (err, image) {
                    if (err) {
                        return res.send(err);
                    }
                    image.toBuffer(filetype, function (err, buffer) {
                        if (err) {
                            res.send(err);
                        }
                        res.set({"content-type": "image/"+filetype}).send(buffer);
                    });
                });
            });
        } else {
            res.sendFile(__dirname + '/public/userFiles/avatars/' + req.params.file);
        }
    });
    app.use('/userFiles', express.static(path.join(__dirname + '/public/userFiles')));
    app.get("/favicon.ico", function (req,res) {
        res.set('Cache-Control', 'max-age=0').sendFile(__dirname + '/public/favicon.ico');
    });
    app.get("/robots.txt", function (req,res) {
        console.log("Someone or Something opened the robots.txt!");
        fs.readFile(__dirname + '/public/robots.txt', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            data = data + "\nSitemap: " + config.APP_URL + "sitemap.txt";
            res.set('content-type', 'text/plain').send(data);
        });
    });
    
    app.get("/app.min.js", function (req, res) {
        res.set('Cache-Control', 'max-age=0').sendFile(__dirname + '/public/app.min.js');
    });
    
    app.get("/vendorLiscenses.txt", function (req, res) {
        res.sendFile(__dirname + '/public/vendorLiscenses.txt');
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
    res.set('Cache-Control', 'max-age=0').sendFile(__dirname + '/public/index.html');
});

function checkFilesExist (files) {
    
    fs.stat(files[0], function (err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.mkdir(files[0], function (err) {
                    if (err) {
                        throw new Error (err);
                    }
                    if (files.length !== 1) {
                        checkFilesExist(files.slice(1));
                    }
                });
            } else {
                throw new Error(err);
            }
        } else {
            if (files.length !== 1) {
                checkFilesExist(files.slice(1));
            }
        }   
    });
}

http.createServer(app).listen(app.get('port'), app.get('IP'), function() {
    checkFilesExist([__dirname + '/public/postFiles', __dirname + '/public/userFiles', __dirname + '/public/userFiles/avatars']);
    console.log('Server listening on port ' + app.get('port'));
    require('./server/helpers/minifyJavascript')();
});