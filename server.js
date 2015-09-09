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
    _               = require('lodash'),
    bodyParser      = require('body-parser');
    

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
        debug: false,
        outputStyle: 'expanded',
        
        error: function(err) {console.log(err);}
      }));
    app.use('/css', express.static(path.join(__dirname + '/public/css')));
    app.use('/images', express.static(path.join(__dirname + '/public/images')));
    app.use('/js', express.static(path.join(__dirname + '/public/js')));
    app.use('/vendor', express.static(path.join(__dirname + '/public/vendor')));
    app.use('/views', express.static(path.join(__dirname + '/public/views')));
    app.use('/postFiles', express.static(path.join(__dirname + '/public/postFiles')));
    app.use(bodyParser.json({limit: '3mb'}));
    
try {
    var verify = require('./server/database/verifyCredentials');
    var mongoConnect = require('./server/database/databaseConnect');
    app.enable('canPost');
} catch (e) {
    var readerConnect = require('./server/database/readerConnect');
    app.disable('canPost');
    console.log('Server was not able to log in to database.');
}

//Retrieves list of posts from database and then stores them in a variable to be used throughout the server session.
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
        //The postList here is ordered by date explicitly, later mentions only append posts onto the end. It's presumed that the server
        //would put the newer posts towards the end of the array (since it is pushing the post to the array).
        postList = _.sortBy(posts,'date');
    }
});

var multer      = require('multer'),
    storage     = multer.diskStorage({
        destination: function (request, file, cb) {
            if (verify.credentials(request.body.username,request.body.password)) {
                console.log("attemtping to save image");
                if (fs.existsSync('public/postFiles/'+currentPostNum)) {
                    cb(null, 'public/postFiles/'+currentPostNum);
                } else {
                    fs.mkdirSync('public/postFiles/'+currentPostNum);
                    cb(null, 'public/postFiles/'+currentPostNum);
                }
            } else {
                console.log("Ah, crap. A user-uploaded image could not be saved.");
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
    } else if (request.query.main) {
        console.log('success');
        response.send({
            success:true,
            mdPreview: postList.slice(-2),
            smPreview: postList.slice(-6,-2)
        });
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

app.post('/create', /*upload.fields([{name:'headImage', maxCount:1},{name:"bodyImage"}]),*/ upload.single('imageHead'), function(request, response) {
    if (app.get('canPost')) {
        if (verify.credentials(request.body.username,request.body.password)) {
        
            var newPost
            /*if (request.files.headImage) {
                newPost = {
                    id: currentPostNum,
                    title: request.body.title,
                    author: request.body.username,
                    content: request.body.content,
                    categories: request.body.categories,
                    imageHead: request.files.headImage[0].path.substring(7)
                };
            } else {*/
                newPost = {
                    id: currentPostNum,
                    title: request.body.title,
                    author: request.body.username,
                    content: request.body.content,
                    categories: request.body.categories,
                    imageHead: request.body.imageHead
                };
                console.log(request.body);
            //}
            var post = new Post(newPost);
            postList.push(post);
            
            post.save(function(err, model) {
                if (err) {
                    response.status(500).send(err);
                }
                else {
                    currentPostNum += 1;
                    console.log("A user has added another post to the database. There are now " + currentPostNum + " posts in the database.");
                    response.send('Post Success');
                }
            });
        } else {
            response.status(401).send('Invalid Login');
        }
    } else {
        response.status(503).send('This server cannot post to the database. It either lacks the authority to write to the database or does not have any way to validate user credentials. Please contact administrator for more details.');
    }
});

app.post('/test', upload.single(), function(request, response) {
    for (var i in request) {
        console.log(i);
    }
    console.log(request.query);
    console.log(request.body);
    response.send("success");
}); 

app.get('*', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

http.createServer(app).listen(app.get('port'), app.get('IP'), function() {
    console.log('Server listening on port ' + app.get('port'));
});