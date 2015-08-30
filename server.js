"use strict";
var fs              = require('fs'),
    express         = require('express'),
    path            = require('path'),
    http            = require('http'),
    url             = require('url'),
    Post            = require('./server/database/postSchema'),
    Author          = require('./server/database/authorSchema'),
    Event           = require('./server/database/eventSchema'),
    sassMiddleware  = require('node-sass-middleware'),
    _               = require('lodash');
    

    var app = express();
    app.set('port', process.env.PORT || 8000);
    app.set('IP', process.env.IP || '127.0.0.1');
    // adding the sass middleware - comes before static css
    /*app.use(
      sassMiddleware({
        src: path.join(__dirname + '/public/sass'),
        dest: path.join(__dirname + '/public/css'),
        debug: true,
        outputStyle: 'compressed',
        
        error: function() {console.log("something Happened");}
      })
    );*/
    app.use('/css', sassMiddleware({
        src: path.join(__dirname + '/public/sass'),
        dest: path.join(__dirname + '/public/css'),
        debug: true,
        outputStyle: 'compressed',
        
        error: function(err) {console.log(err);}
      }));
    app.use('/images', express.static(path.join(__dirname + '/public/images')));
    app.use('/js', express.static(path.join(__dirname + '/public/js')));
    app.use('/vendor', express.static(path.join(__dirname + '/public/vendor')));
    app.use('/views', express.static(path.join(__dirname + '/public/views')));
    app.use('/postFiles', express.static(path.join(__dirname + '/public/postFiles')));
    
try {
    var verify = require('./server/database/verifyCredentials');
    var mongoConnect = require('./server/database/databaseConnect');
    app.enable('canPost');
} catch (e) {
    var readerConnect = require('./server/database/readerConnect');
    app.disable('canPost');
    console.log('Server was not able to log in to database.');
}

var currentPostNum=0;
var postList;
Post.find(function(err, posts) {
    if (err) {
        console.log("Server cannot connect to database.")
    }
    else {
        for(var i=0;i<posts.length;i++){
            if (posts[i].id>currentPostNum) {
                currentPostNum = posts[i].id;
            }
        }
        currentPostNum +=1;
        console.log("There are currently " + currentPostNum + " posts in the database.");
        postList = posts;
    }
});

var multer      = require('multer'),
    storage     = multer.diskStorage({
        destination: function (request, file, cb) {
            console.log("line 62 " + JSON.stringify(file));
            console.log("line 63 " + JSON.stringify(request.body));
            if (verify.credentials(request.body.username,request.body.password)) {
                console.log("Attempting to save post image now.");
                if (fs.existsSync('public/postFiles/'+currentPostNum)) {
                    cb(null, 'public/postFiles/'+currentPostNum);
                    console.log("Post image successfully saved. Directory is not new though.");
                } else {
                    fs.mkdirSync('public/postFiles/'+currentPostNum);
                    cb(null, 'public/postFiles/'+currentPostNum);
                    console.log("Post image successfully saved in new directory.");
                }
            } else {
                console.log("Image couldnot be saved.");
            }
        },
        filename: function (request, file, cb) {
            cb(null, file.originalname);
        }
    }),
    upload      = multer({storage: storage});
    
app.get("/favicon.ico", function(request, response){
    response.sendFile(__dirname + '/public/favicon.ico');
});

app.get("/posts.json", function(request, response) {
    console.log("request params " + JSON.stringify(request.params));
    console.log('request url ' + JSON.stringify(request.url));
    console.log('request query ' + JSON.stringify(request.query));
    if (request.query.post) {
        var post = _.find(postList, {id: Number(request.query.post)});
        if (!post) {
            response.status(404).send({
                success:false,
            });
        } else {
            response.send({
                success:true,
                post:post
            });
        }
    } else {
        response.send({
            success:true,
            posts:postList
        });
    }
});

app.get("/authors.json", function(request, response) {
    Author.find(function(err, authors) {
        if (err) {
            response.status(500).send({
                success:false
            });
        }
        else {
            response.send({
                success:true,
                authors:authors
            });
        }
    });
});

app.get("/events.json", function(request, response) {
    Event.find(function(err, events) {
        if (err) {
            response.status(500).send({
                success:false
            });
        }
        else {
            response.send({
                success:true,
                events:events
            });
        }
    });
});



app.get("/google*", function(request, response) {
    var verifyUrl = request.url.substring(7);
    console.log("A user or a GoogleBot attempted to verify the website at: google" + verifyUrl);
    response.sendFile(__dirname + '/server/verification/google' + verifyUrl);
});

app.post('/create', upload.fields([{name:'headImage', maxCount:1},{name:"bodyImage"}]), function(request, response) {
    if (app.get('canPost')) {
        console.log(request.files);
        if (verify.credentials(request.body.username,request.body.password)) {
            
            console.log(request.body);
            var newPost = {
                id: currentPostNum,
                title: request.body.title,
                author: request.body.username,
                content: request.body.content,
                categories: request.body.categories,
                imageHead: request.files.headImage[0].path.substring(7)
            };
            console.log(newPost.images);
            postList.push(newPost);
            var post = new Post(newPost);
            
            post.save(function(err, model) {
                if (err) {
                    response.status(500).send(err);
                }
                else {
                    currentPostNum += 1;
                    console.log("A user has added another post to the database. There are now " + currentPostNum + " posts in the database.");
                    response.redirect('/');
                }
            });
        } else {
            response.status(401).send('Invalid Password');
        }
    } else {
        response.status(503).send('This server cannot post to the database. It either lacks the authority to write to the database or does not have any way to validate user credentials. Please contact administrator for more details.');
    }
});

app.get('*', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

http.createServer(app).listen(app.get('port'), app.get('IP'), function() {
    console.log('Server listening on port ' + app.get('port'));
});