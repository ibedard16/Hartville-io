"use strict";
var express             = require('express'),
    fs                  = require('fs'),
    path                = require('path'),
    http                = require('http'),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    lwip                = require('lwip'),
    compression         = require('compression'),
    config              = require('./server/config'),
    OAuth               = require('./server/routes/OAuth'),
    sitemap             = require('./server/routes/sitemap'),
    auth                = require('./server/routes/auth'),
    resources           = require('./server/routes/resources'),
    css                 = require('./server/routes/css'),
    checkNescessaryFiles= require('./server/helpers/checkNescessaryFilesExist'),
    minifyJavascript    = require('./server/helpers/minifyJavascript'),
    app                 = express();

checkNescessaryFiles();
minifyJavascript();
    
mongoose.connect(config.DATABASE_URL);

app.use(bodyParser.json({limit: '3mb'}));
app.use(compression());

app.use(function (request, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    next();
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
    //Set at avatar upload
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

app.use('/sitemap.txt', sitemap);

app.use('/resources', resources);

app.use('/auth', auth);

app.use('/OAuth', OAuth);

app.use('/css', css);

app.get("/google*", function (request, response) {
    var verifyUrl = request.url.substring(7);
    console.log("A user or a GoogleBot attempted to verify the website at: google" + verifyUrl);
    response.sendFile(__dirname + '/server/verification/google' + verifyUrl);
});

app.get('*', function(req, res) {
    res.set('Cache-Control', 'max-age=0').sendFile(__dirname + '/public/index.html');
});

http.createServer(app).listen(process.env.PORT || 80, process.env.IP || '0.0.0.0', function() {
    console.log('Server listening on port ' + process.env.PORT || 80);
});