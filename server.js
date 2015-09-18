"use strict";
var fs              = require('fs'),
    express         = require('express'),
    path            = require('path'),
    http            = require('http'),
    url             = require('url'),
    Post            = require('./server/database/postSchema'),
    Author          = require('./server/database/authorSchema'),
    User            = require('./server/database/userSchema'),
    Event           = require('./server/database/eventSchema'),
    jwt             = require('jwt-simple'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
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
    app.use(passport.initialize());
    
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    
    var strategyOptions = {
        usernameField: 'email'
    };
    
    var loginStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
        var searchUser = {
            email: email
        };
        User.findOne(searchUser, function (err, user) {
            if (err) return done(err);
            
            if (!user) {
                return done(null, false, {message: 'Email not Found'});
            }
            
            user.comparePasswords(password, function (err, isMatch) {
                if (err) return done(err);
                
                if (!isMatch) {
                    return done(null, false, {message: 'Invalid Login'});
                } 
                
                return done(null, user);
                
            });
        });
    });
    
    var signupStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
        var newUser = new User({
            email: email,
            password: password
        });
    
        newUser.save(function (err) {
            if (err) {
                return done(null, false, err);
            } else {
                done(null, newUser);
            }
        });
    });
    
    passport.use('local-login', loginStrategy);
    passport.use('local-signup', signupStrategy);
    
    app.use(bodyParser.json({limit: '3mb'}));
    app.use(function (request, response, next) {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        next();
    });
    
try {
    var verify = require('./server/database/verifyCredentials');
    var mongoConnect = require('./server/database/databaseConnect');
    app.enable('canPost');
} catch (e) {
    var readerConnect = require('./server/database/readerConnect');
    app.disable('canPost');
    console.log('Server was not able to log in to database.');
}

//Retrieves list of posts from database and then stores them in variables to be used throughout the server session.
    //currentPostID = the current highest ID value a post has.
var currentPostID = -1,
    //postList = an array of all posts, each post's position in the list is determined by its ID value.
    postList = [],
    //pages = an array of arrays, where each inner array is a collection of five posts. Starts counting at 1.
    pages = [],
    //postCount = total number of posts currently in the blog. 
    //This is different than calling postList.length, because there are usually some 'null' posts in the list.
    //This number is gives the total count of real posts in the server.
    postCount,
    //Function used to update the content of the pages, called when server first starts AND whenever a post is saved.
    pagesUpdate = function() {
        var currentPage = 1,
            pagesConstructor = [],
            //lodash sorts posts before they're turned into pages.
            sortedPages = _.sortByOrder(
                //filter turns back all posts that have an id. If a post exists and is formatted properly, it will be returned.
                _.filter(postList, 'id'),
                ['date'], 
                ['desc']);
        pagesConstructor[currentPage] = [];
        //for loop defines array of pages.
        for (var listIndex=0; listIndex < sortedPages.length; listIndex++) {
            
            //Extract next post from sorted list
            var nextPost = sortedPages[listIndex];
            
            //Assign next post to an array of the pages Constructor
            pagesConstructor[currentPage][listIndex%5] = nextPost;
            
            //When the page has 5 items, advance to the next page.
            if (listIndex%5 == 4) {
                currentPage += 1;
                //initialize the current page.
                pagesConstructor[currentPage] = [];
            }
        }
        //after pagesConstructor is finished, use constructor to make the pages.
        pages = pagesConstructor;
        //simple status log
        console.log('There are currently ' + postCount + ' posts on the server for a total of ' + currentPage + ' pages on the server.'
            + ' The highest post ID value is ' + currentPostID + '.');
    };
Post.find(function(err, posts) {
    if (err) {
        console.log("Server cannot connect to database.");
    }
    else {
        for(var i=0;i<posts.length;i++){
            if (postList[posts[i].id]===undefined){
                postList[posts[i].id] = posts[i];
            } else {
                console.log("DUPLICATE POST ALERT! DUPLICATE POST ALERT!");
            }
            if (posts[i].id>currentPostID) {
                currentPostID = posts[i].id;
            }
        }
        postCount = posts.length;
        pagesUpdate();
    }
});

var multer      = require('multer'),
    storage     = multer.diskStorage({
        destination: function (request, file, cb) {
            if (verify.credentials(request.body.username,request.body.password)) {
                console.log("attemtping to save image");
                if (fs.existsSync('public/postFiles/'+currentPostID)) {
                    cb(null, 'public/postFiles/'+currentPostID);
                } else {
                    fs.mkdirSync('public/postFiles/'+currentPostID);
                    cb(null, 'public/postFiles/'+currentPostID);
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
    } else if (request.query.page == 0) {
        var postsToSend = [];
        for (var i = -1; postsToSend.length < 6; i--) {
            if (postList.slice(i)[0]) {
                postsToSend.push(postList.slice(i)[0]);
            }
        }
        response.send({
            success:true,
            posts: postsToSend,
            postCount: postCount
        });
    } else if (request.query.page > 0) {
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
                    id: currentPostID,
                    title: request.body.title,
                    author: request.body.username,
                    content: request.body.content,
                    categories: request.body.categories,
                    imageHead: request.files.headImage[0].path.substring(7)
                };
            } else {
                newPost = {
                    id: currentPostID,
                    title: request.body.title,
                    author: request.body.username,
                    content: request.body.content,
                    categories: request.body.categories,
                    imageHead: request.body.imageHead
                };
                console.log(request.body);
            }*/

/*var savePost = function (post) {
    
};*/

app.post('/posts.json', upload.single('imageHead'), function(request, response) {
    if (app.get('canPost')) {
        if (!request.headers.authorization) {
            response.status(401).send('Invalid Login');
        }
        var token = request.headers.authorization.split(' ')[1];
        
        try {
            var payload = jwt.decode(token, 'shhh...');
        } catch (e) {
            response.status(401).send('Invalid Login');
        }
        
        if (!payload.sub) {
            response.status(401).send('Invalid Login');
        }
        
        console.log(payload);
        if (verify.credentials(request.body.username,request.body.password)) {
            response.send({head:'Post Success', redirect: 'new'});
            /*currentPostID++;
            var post = new Post({
                    id: currentPostID,
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
                    response.send({head:'Post Success', redirect: 'blog/post/'+post.id});
                }
            });*/
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

app.post("/signup", passport.authenticate('local-signup'), function (request, response) {
    createSendToken(request.user, response);
});

app.post('/login', passport.authenticate('local-login'), function(request, response) {
    createSendToken(request.user, response);
});

function createSendToken (user, response) {
    var payload = {
        //iss: request.hostname,
        sub: user.id
    };
    
    var token = jwt.encode(payload, 'shhh...');
    
    response.status(200).send({
        user: user.toJSON(), 
        token: token
    });
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