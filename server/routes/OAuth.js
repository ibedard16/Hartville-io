var externalRequest = require('request'),
    User = require('../models/userSchema'),
    createSendToken = require('../helpers/createSendToken'),
    notify = require('../helpers/notify'),
    config = require('../config'),
    express = require("express"),
    checkPermission = require('../middleware/checkPermission'),
    retreiveAndSaveAvatar = require('../helpers/retreiveAndSaveAvatar'),
    router = express.Router();

function getFacebookProfile (req, cb) {
    var tokenUrl = 'https://graph.facebook.com/v2.4/oauth/access_token',
        apiUrl = 'https://graph.facebook.com/v2.4/me',
        tokenParams = {
            client_id: req.body.clientId,
            redirect_uri: req.body.redirectUri,
            code: req.body.code,
            client_secret: config.FACEBOOK_SECRET
        };
    
    externalRequest.post(tokenUrl, {qs: tokenParams}, function (err, response, accessToken) {
        
        if (err) return cb(err);
        
        accessToken = JSON.parse(accessToken);
        
        var apiParams = {
            fields: 'email, name, id',
            access_token: accessToken.access_token
        };
        
        externalRequest.get(apiUrl, {qs: apiParams}, function (err, response, profile) {
            
            profile = JSON.parse(profile);
            
            if (err) return cb(err);
            
            if (profile.error) {
                return cb(profile.error);
            }
            
            cb(null, profile);
        });
    });
}

function getGoogleProfile (req, cb) {
    var authUrl = 'https://accounts.google.com/o/oauth2/token',
        apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect',
        params = {
            client_id: req.body.clientId,
            redirect_uri: req.body.redirectUri,
            code: req.body.code,
            grant_type: 'authorization_code',
            client_secret: config.GOOGLE_SECRET
        };
    
    externalRequest.post(authUrl, {
        json: true,
        form: params
    }, function (err, response, token) {
        
        if (err) { return cb(err);}
        
        var accessToken = token.access_token,
            headers = {
                Authorization: 'Bearer ' + accessToken
            };
        externalRequest.get(apiUrl, {
            headers: headers,
            json: true
        }, function (err, response, profile) {
            
            if (err) {return cb(err);}
            
            if (profile.error) {
                console.log(profile.error);
                return cb(profile.error);
            }
            
            cb (null, profile);
        });
    });
}

function getGithubProfile (req, cb) {
    var authUrl = 'https://github.com/login/oauth/access_token',
        apiUrl = 'https://api.github.com/user',
        params = {
            client_id: req.body.clientId,
            redirect_uri: req.body.redirectUri,
            code: req.body.code,
            grant_type: 'authorization_code',
            client_secret: config.GITHUB_SECRET
        };
    
    externalRequest.post({
        url: authUrl,
        qs: params,
        headers: {
            'User-Agent': 'Hartville.io',
            accept: 'application/json'
        }
    }, function (err, response, token) {
        
        if (err) { return cb(err);}
        
        console.log('github token', token);
        
        var accessToken = JSON.parse(token).access_token;
        
        externalRequest.get(apiUrl, {
            qs: {
                access_token: accessToken
            },
            headers: {
                'User-Agent': 'Hartville.io',
                accept: 'application/json'
            }
        }, function (err, response, profile) {
            
            if (err) {return cb(err);}
            
            profile = JSON.parse(profile);
            
            if (profile.error) {
                console.log(profile.error);
                return cb(err);
            }
            
            cb(null, profile);
        });
    });
}

router.post('/facebook', function (req, res) {
    getFacebookProfile(req, function (err, profile) {
        if (err) return res.status(500).send(err);
        
        User.getUser('facebookId', profile.id, function (err, existingUser) {
            
            if (err) return res.send(err);
            
            if (existingUser) {
                
                return createSendToken(existingUser, res);
                
            } else {
                var newUser = new User({
                    contactEmail: profile.email, 
                    facebookId: profile.id,
                    displayName: profile.name
                });
                retreiveAndSaveAvatar('https://graph.facebook.com/' + profile.id + '/picture?width=80&height=80', newUser._id, function (err, filename) {
                    if (err) {
                        return res.send(err);
                    }
                    newUser.avatar = filename;
                    newUser.save(function (err) {
                        if (err) {
                            return res.send(err);
                        } else {
                            return createSendToken(newUser, res);
                        }
                    });
                });
            }
        });
    });
});

router.post('/google', function (req, res) {
    getGoogleProfile(req, function (err, profile) {
        if (err) {
            return res.status(500).send(err);
        }
        
        User.getUser('googleId', profile.sub, function (err, foundUser) {
            
            if (err) {return res.status(500).send(err);}
            
            if (foundUser) {
                
                return createSendToken(foundUser, res);
                
            } else {
                
                var newUser = new User({
                    googleId: profile.sub,
                    contactEmail: profile.email,
                    displayName: profile.name
                });
                retreiveAndSaveAvatar(profile.picture, newUser._id, function (err, filename) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    newUser.avatar = filename;
                    newUser.save(function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        } else {
                            createSendToken(newUser, res);
                        }
                    });
                });
            }
        });
    });
});

router.post('/github', function (req, res) {
    getGithubProfile(req, function (err, profile) {
        if (err) {return res.status(500).send(err)}
        
        User.getUser('githubId', profile.id, function (err, foundUser) {
            
            if (err) {return res.status(500).send(err);}
            
            if (foundUser) {
                
                return createSendToken(foundUser, res);
                
            } else {
                
                var newUser = new User({
                    githubId: profile.id,
                    displayName: profile.login
                });
                
                if (profile.email) {
                    newUser.contactEmail = profile.email;
                }
                
                retreiveAndSaveAvatar(profile.avatar_url, newUser._id, function (err, filename) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    newUser.avatar = filename;
                    newUser.save(function (err) {
                        if (err) {
                            return res.status(500).send(err);
                        } else {
                            createSendToken(newUser, res);
                        }
                    });
                });
            }
        });
    });
});

router.post('/binder/:provider', checkPermission('authenticated'), function (req, res) {
    switch (req.params.provider) {
        case 'google':
            getGoogleProfile(req, function (err, profile) {
                if (err) {
                    return res.status(500).send(err);
                }
                    
                User.getUser('googleId', profile.sub, function (err, foundUser) {
                    
                    if (err) {return res.status(500).send(err);}
                    
                    if (foundUser) {
                        
                        return notify(res, 'error', 'That account has already been bound to a different user.');
                        
                    } else {
                        
                        req.user.googleId = profile.sub;
                        
                        req.user.save(function (err) {
                            if (err) {
                                return res.status(500).send(err);
                            } else {
                                return notify(res, 'success', 'Account bound successfully');
                            }
                        });
                    }
                });
            });
            break;
        case 'facebook':
            getFacebookProfile(req, function (err, profile) {
                if (err) {
                    return res.status(500).send(err);
                }
                    
                User.getUser('facebookId', profile.id, function (err, foundUser) {
                    
                    if (err) {return res.status(500).send(err);}
                    
                    if (foundUser) {
                        
                        return notify(res, 'error', 'That account has already been bound to a different user.');
                        
                    } else {
                        
                        req.user.facebookId = profile.id;
                        
                        req.user.save(function (err) {
                            if (err) {
                                return res.status(500).send(err);
                            } else {
                                return notify(res, 'success', 'Account bound successfully');
                            }
                        });
                    }
                });
            });
            break;
        case 'github':
            getGithubProfile(req, function (err, profile) {
                if (err) {
                    return res.status(500).send(err);
                }
                User.getUser('githubId', profile.id, function (err, foundUser) {
                    
                    if (err) {return res.status(500).send(err);}
                    
                    if (foundUser) {
                        return notify(res, 'error', 'That account has already been bound to a different user.');
                    } else {
                        
                        req.user.githubId = profile.id;
                        
                        req.user.save(function (err) {
                            if (err) {
                                return res.status(500).send(err);
                            } else {
                                return notify(res, 'success', 'Account bound successfully');
                            }
                        });
                    }
                });
            });
            break;
        default:
            notify(res, 'error', 'Provider not recognized.');
    }
});

router.post('*', function(req, res) {
    res.status(400).notify('error', 'OAuth Provider not recognized by server. Please contact an admin.', 'OAuth provider not recognized.');
});

module.exports = router;