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
var currentPostNum=0,
    postList = [],
    postCount,
    pages = [],
    pagesUpdate = function() {
        var pageNum = 1;
        pages[pageNum] = [];
        for(var i=1,j=0; i<postList.length; i++,j++){
            var nextPost = postList.slice(-i)[0];
            if (nextPost) {
                pages[pageNum][j] = nextPost;
            } else {
                j -= 1;
            }
            
            if (j == 4 && j) {
                pageNum++, j=-1;
                pages[pageNum] = [];
            }
        }
        console.log('There are currently ' + postCount + ' posts on the server for a total of ' + pageNum + ' pages on the server.'
            + ' The highest post ID value is ' + currentPostNum + '.');
    };
Post.find(function(err, posts) {
    if (err) {
        console.log("Server cannot connect to database.");
    }
    else {
        for(var i=0;i<posts.length;i++){
            if (postList[posts[i].id]==undefined){
                postList[posts[i].id] = posts[i];
            } else {
                console.log("DUPLICATE POST ALERT! DUPLICATE POST ALERT!");
            }
            if (posts[i].id>currentPostNum) {
                currentPostNum = posts[i].id;
            }
        }
        postCount = posts.length;
        pagesUpdate();
        currentPostNum +=1;
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

app.get("/post/:id", function(request, response) {
    var post = _.find(postList, {id: Number(request.params.id)});
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
});

app.get("/posts.json", function(request, response) {
    console.log('request query ' + JSON.stringify(request.query));
    if (request.query.post) {
        var post,
            postNum = Number(request.query.post);
        if (postNum >= 0) {
            post = postList[postNum];
        } else if (postNum < -1){
            post = postList.slice(postNum, postNum+1)[0];
        } else {
            post = postList.slice(-1)[0];
        }
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
        var postsToSend = [];
        for (var i = -1; postsToSend.length<6; i--) {
            if (postList.slice(i)[0]) {
                postsToSend.push(postList.slice(i)[0]);
            }
        }
        response.send({
            success:true,
            mdPreview: postsToSend.slice(0,2),
            smPreview: postsToSend.slice(2,6)
        });
    } else if (request.query.page) {
        response.send({
            success:true,
            posts: pages[Number(request.query.page)],
            postCount: postCount
        });
    } else if (request.query.number) {
        response.send({
            success: true,
            postCount: postCount
        });
    } else {
        response.send({
            success:true,
            posts:postList
        });
    }
});


/*upload.fields([{name:'headImage', maxCount:1},{name:"bodyImage"}]),*/ 

            /*var newPost;
            if (request.files.headImage) {
                newPost = {
                    id: currentPostNum,
                    title: request.body.title,
                    author: request.body.username,
                    content: request.body.content,
                    categories: request.body.categories,
                    imageHead: request.files.headImage[0].path.substring(7)
                };
            } else {
                newPost = {
                    id: currentPostNum,
                    title: request.body.title,
                    author: request.body.username,
                    content: request.body.content,
                    categories: request.body.categories,
                    imageHead: request.body.imageHead
                };
                console.log(request.body);
            }*/
app.post('/posts.json', upload.single('imageHead'), function(request, response) {
    if (app.get('canPost')) {
        if (verify.credentials(request.body.username,request.body.password)) {
            var post = new Post({
                    id: currentPostNum,
                    title: request.body.title,
                    author: request.body.username,
                    content: request.body.content,
                    categories: request.body.categories,
                    imageHead: request.body.imageHead
                });
            
            post.save(function(err, model) {
                if (err) {
                    response.status(500).send(err);
                }
                else {
                    console.log("A user has added another post to the database.");
                    postCount++;
                    postList.push(post);
                    pagesUpdate();
                    currentPostNum++;
                    response.send({head:'Post Success', redirect: 'blog/post/'+post.id});
                }
            });
        } else {
            response.status(401).send('Invalid Login');
        }
    } else {
        response.status(503).send('This server cannot post to the database. It either lacks the authority to write to the database or does not have any way to validate user credentials. Please contact administrator for more details.');
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

app.get('*', function(request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

http.createServer(app).listen(app.get('port'), app.get('IP'), function() {
    console.log('Server listening on port ' + app.get('port'));
});