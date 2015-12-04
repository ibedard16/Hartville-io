var express         = require('express'),
    Post            = require('../models/postSchema'),
    checkPermission = require('../middleware/checkPermission'),
    User            = require('../models/userSchema'),
    notify          = require('../helpers/notify'),
    multer          = require('multer'),
    config          = require('../config'),
    fs              = require('fs'),
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
    router      = express.Router();
    
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
                if (foundPost) {
                    return res.send(foundPost);
                } else {
                    return res.status(404).notify('error','The post you requested was not found. This means it was either deleted or it never existed to begin with.');
                }
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
    
    function postSaveSuccess (postId) {
        res.send({success: true, redirect: "/blog/post/" + postId});
    }
    
    function saveImage(imageString, postId, cb) {
        var regex = /^data:.+\/(.+);base64,(.*)$/,
            matches = req.body.imageHead.match(regex),
            ext = matches[1],
            data = matches[2],
            buffer = new Buffer(data, 'base64');
        fs.mkdir(config.baseDirectory + '/public/postFiles/' + postId, function () {
            fs.writeFile(config.baseDirectory + '/public/postFiles/' + postId + '/headImage.' + ext, buffer, function (err) {
                if (err) {
                    return cb(err);
                }
                return cb(null, '/postFiles/' + postId + '/headImage.' + ext);
            });
        });
    }
    
    if (req.query.deletePost) {
        postId = Number(req.query.deletePost);
        return Post.findOne({ id:postId }).remove(function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            
            postSaveSuccess();
        });
    }
    
    if (!req.body.title) {
        return res.status(400).notify('warning', 'The post cannot be published without a title.', 'Missing Title');
    }
    
    if (!req.body.content) {
        return res.status(400).notify('warning', 'The post cannot be published without content.', 'No Content');
    }
    
    var postId;
    
    if (req.query.updatePost) {
        postId = Number(req.query.updatePost);
        return Post.findOne({id:postId}, function (err, post) {
            function savePost(postToSave) {
                postToSave.save(function(err, model) {
                    if (err) {
                        console.log(err);
                        res.status(500).send(err);
                    }
                    else {
                        postSaveSuccess(post.id);
                    }
                });
            }
            if (err) return res.status(500).send(err);
            
            if (req.user._id !== post.authorId && !req.user.permissions.setPermissions) {
                return res.status(400).notify('error', 'You are not the author of that post, so you do not have the authority to edit it.');
            }
            
            post.title = req.body.title;
            post.content = req.body.content;
            post.categories = req.body.categories;
            post.edits.push({
                date: Date.now(),
                authorId: req.user._id
            });
            
            if (req.body.imageHead !== post.imageHead) {
                if (post.imageHead) {
                    fs.unlinkSync(config.baseDirectory + '/public' + post.imageHead);
                }
                if (!req.body.imageHead) {
                    post.imageHead = undefined;
                    savePost(post);
                } else {
                    saveImage(req.body.imageHead, post.id, function (err, filename) {
                        if (err) {
                            res.status(500).notify('error', 'there was an error');
                            throw new Error(err);
                        }
                        post.imageHead = filename;
                        savePost(post);
                    });
                }
            } else {
                savePost(post);
            }
        });
    }
    
    Post.findOne().sort('-id').exec(function (err, id) {
        if (err) return res.status(500).send(err);
        
        postId = id ? id.id + 1 : 0;
        
        function savePost () {
            var post = new Post({
                id: postId,
                title: req.body.title,
                authorId: req.user._id,
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
                    postSaveSuccess(post.id);
                }
            });
        }
        
        if (req.body.imageHead) {
            saveImage(req.body.imageHead, postId, function (err, filename) {
                if (err) {
                    res.status(500).notify('err', 'There was an error!');
                    throw new Error(err);
                }
                
                req.body.imageHead = filename;
                savePost();
            });
        } else {
            savePost();
        }
    
    });
});

router.get("/client_config", function (req, res) {
    res.send('app.constant("appConfig", ' + JSON.stringify(config.client_config) + ');');
});

router.get("/user", checkPermission(), function (req, res) {
    User.getUser('_id', req.query.id, function (err, user) {
        if (err) return res.send(err);
        
        if (!user) {
            return res.status(404).send({
                displayName: "User not found.",
                bio: "This user was not found. We're not completely sure they ever existed."
            });
        }
        
        var sentUser = {
            avatar: user.avatar,
            displayName: user.displayName,
            bio: user.bio
        };
            
        if (req.user) {
            sentUser['googleBound'] = !!req.user.googleId;
            sentUser['githubBound'] = !!req.user.githubId;
            sentUser['facebookBound'] = !!req.user.facebookId;
        }
        
        res.send(sentUser);
    });
});

router.post("/user", checkPermission('authenticated'), function (req, res) {
    function saveUser () {
        req.user.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                if (req.body.user ) {
                    if (req.body.newAvatar) {
                        notify(res, 'success', 'Your profile information has been updated. You might need to refresh the website before your new avatar appears.', 'Success');
                    } else {
                        notify(res, 'success', 'Your profile information has been updated.');
                    }
                } else {
                notify(res, 'warning', 'That account has been unbound.');
                }
            }
        });
    }
    
    function cannotUnbind () {
        notify(res, 'error', 'You cannot unbind your ' + req.query.unbind + ' account because it is the only way to log in to this account. Please add a password, bind a different account, or delete your account here.');
    }
    
    if (req.query.unbind) {
        var unbindAccount = function (provider) {
            req.user[provider + 'Id'] = undefined;
            saveUser();
        };
        if (!!req.user.password) {
            return unbindAccount(req.query.unbind);
        } else {
            var boundOAuthCount = 0;
            for (var prop in config.client_config.OAuth_providers) {
                if (req.user[prop + 'Id']) {
                    boundOAuthCount += 1;
                }
            }
            if (boundOAuthCount === 1 && !!req.user[req.query.unbind + 'Id']) {
                return cannotUnbind();
            } else if (!req.user[req.query.unbind + 'Id']) {
                return notify(res, 'error', 'You have not even bound that OAuth provider to this account. We can\'t unbind it for you if it hasn\'t been bound in the first place!');
            } else {
                return unbindAccount(req.query.unbind);
            }
        }
    }
    
    req.user.bio = req.body.user.bio;
    req.user.displayName = req.body.user.displayName;
    
    if (req.body.user.newAvatar) {
        var regex = /^data:.+\/(.+);base64,(.*)$/,
            matches = req.body.user.newAvatar.match(regex),
            ext = matches[1],
            data = matches[2],
            buffer = new Buffer(data, 'base64');
        fs.unlink(config.baseDirectory + '/public/' + req.user.avatar, function (err) {
            if (err) {
                return notify(res, 'error', err, 'An Error Happened');
            }
            
            fs.writeFile(config.baseDirectory + '/public/userFiles/avatars/' + req.user._id + '.' + ext, buffer, function (err) {
                if (err) {
                    return notify(res, 'error', err, 'An Error Happened');
                }
                req.user.avatar = 'userFiles/avatars/' + req.user._id + '.' + ext;
                
                saveUser();
            });
            
        });
    } else {
        saveUser();
    }
});

module.exports = router;