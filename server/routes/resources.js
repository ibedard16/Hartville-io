var express         = require('express'),
    Post            = require('../models/postSchema'),
    checkPermission = require('../middleware/checkPermission'),
    Author          = require('../models/authorSchema'),
    User            = require('../models/userSchema'),
    multer          = require('multer'),
    config          = require('../config'),
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
    try {
        req.query.query = JSON.parse(req.query.query);
    } catch(e) {
        req.query.query = {};
    }
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
        
        Post.count(req.query.query, function (err, postCount) {
            
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
                Post.find(req.query.query)
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
                Post.find(req.query.query)
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
        return res.status(400).notify('warning', 'The post cannot be published without a title.', 'Missing Title');
    }
    
    if (!req.body.content) {
        return res.status(400).notify('warning', 'The post cannot be published without content.', 'No Content');
    }
    
    Post.findOne().sort('-id').exec(function (err, id) {
        if (err) return res.status(500).send(err);
        
        var postId = id.id + 1;
        
        var post = new Post({
            id: postId,
            title: req.body.title,
            authorName: req.user.displayName,
            authorId: req.user._id,
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
                res.send({success: true, redirect: "/blog/post/"+post.id});
            }
        });
    });
});

router.get("/client_config", function (req, res) {
    res.send('app.constant("appConfig", ' + JSON.stringify(config.client_config) + ');');
});

router.get("/user", function (req, res) {
    User.getUser('_id', req.query.id, function (err, user) {
        if (err) return res.send(err);
        
        if (!user) {
            return res.send({
                displayName: "User not found.",
                bio: "This user was not found. We're not completely sure they ever existed."
            });
        }
        
        var sentUser = {
            avatar: user.avatar,
            displayName: user.displayName,
            bio: user.bio
        };
        
        res.send(sentUser);
    });
});

router.post("/user", checkPermission(), function (req, res) {
    console.log(req.user);
    console.log(req.body);
    
    req.user.bio = req.body.user.bio;
    req.user.avatar = req.body.user.avatar;
    
    req.user.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            res.notify('success', 'Your profile information has been updated.', 'Success');
        }
    });
});

module.exports = router;