var express         = require('express'),
    Post            = require('../models/postSchema'),
    checkPermission = require('../middleware/checkPermission'),
    Author          = require('../models/authorSchema'),
    Event           = require('../models/eventSchema'),
    multer          = require('multer'),
    storage         = multer.diskStorage({
        destination: function (request, file, cb) {
            /*if (verify.credentials(request.body.username,request.body.password)) {
                console.log("attemtping to save image");
                /*if (fs.existsSync('public/postFiles/'+currentPostID)) {
                    cb(null, 'public/postFiles/'+currentPostID);
                } else {
                    fs.mkdirSync('public/postFiles/'+currentPostID);
                    cb(null, 'public/postFiles/'+currentPostID);
                }
            } else {
                console.log("Ah, crap. A user-uploaded image could not be saved.");
            }*/
            cb('file save not implemented');
        },
        filename: function (request, file, cb) {
            cb(null, file.originalname);
        }
    }),
    upload      = multer({storage: storage}),
    router          = express.Router();
    
router.get('/posts', function(req, res) {
    console.log('request query ' + JSON.stringify(req.query));
    if (req.query.id) {
        
        var postNum = Number(req.query.id);
        
        Post.findOne({id: postNum}, function (err, foundPost) {
            if (err) {
                return res.send(err);
            } else {
                return res.send(foundPost);
            }
        });
        
    } else {
        
        Post.count(function (err, postCount) {
            
            if (err) return res.send (err);
            
            if (!req.query.sortBy) {
                req.query.sortBy = '-date';
            }
            
            if (!req.query.skip || isNaN(Number(req.query.skip))) {
                req.query.skip = 0;
            } else {
                req.query.skip = Number(req.query.skip);
            }
            
            if (!req.query.limitTo || isNaN(Number(req.query.limitTo))) {
                Post.find()
                    .sort(req.query.sortBy)
                    .skip(req.query.skip)
                    .exec(function (err, posts) {
                        if (err) return res.send(err);
                        
                        return res.send({
                            success: true,
                            posts: posts,
                            postCount: postCount
                        });
                    });
            } else {
                Post.find()
                    .sort(req.query.sortBy)
                    .skip(req.query.skip)
                    .limit(Number(req.query.limitTo))
                    .exec(function (err, posts) {
                        if (err) return res.send(err);
                        
                        return res.send({
                            success: true,
                            posts: posts,
                            postCount: postCount
                            });
                    });
            }
        });
    }
});

router.post('/posts', checkPermission('canPost'), upload.single(), function(req, res) {
    
    if (!req.body.title) {
        return res.status(400).send({head: 'Missing Title'});
    }
    
    Post.findOne().sort('-id').exec(function (err, id) {
        if (err) return res.status(500).send(err);
        
        var postId = id.id + 1;
        
        var post = new Post({
            id: postId,
            title: req.body.title,
            author: req.user.displayName,
            avatar: req.user.avatar,
            content: req.body.content,
            categories: req.body.categories,
            imageHead: req.body.imageHead
        });
        
        post.save(function(err, model) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                console.log("A user has added another post to the database.");
                res.send({head:'Post Success', redirect: 'blog/post/' + post.id});
            }
        });
    });
});

router.get("/authors.json", function(request, response) {
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

router.get("/events.json", function(request, response) {
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


module.exports = router;