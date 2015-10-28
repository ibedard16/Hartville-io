var externalRequest = require('request'),
    User = require('../models/userSchema'),
    createSendToken = require('../helpers/createSendToken'),
    config = require('../config'),
    express = require("express"),
    router = express.Router();

router.post('/facebook', function (req, res) {
    var tokenUrl = 'https://graph.facebook.com/v2.4/oauth/access_token',
        apiUrl = 'https://graph.facebook.com/v2.4/me',
        tokenParams = {
            client_id: req.body.clientId,
            redirect_uri: req.body.redirectUri,
            code: req.body.code,
            client_secret: config.FACEBOOK_SECRET
        };
    
    externalRequest.post(tokenUrl, {qs: tokenParams}, function (err, response, accessToken) {
        
        if (err) return res.send(err);
        
        accessToken = JSON.parse(accessToken);
        
        var apiParams = {
            fields: 'email, name, id',
            access_token: accessToken.access_token
        };
        
        externalRequest.get(apiUrl, {qs: apiParams}, function (err, response, profile) {
            
            profile = JSON.parse(profile);
            
            if (err) return res.send(err);
            
            if (profile.error) {
                return res.status(500).send(profile.error);
            }
            
            User.getUser('facebookId', profile.id, function (err, existingUser) {
                
                if (err) return res.send(err);
                
                if (existingUser) {
                    
                    return createSendToken(existingUser, res);
                    
                } else {
                    
                    var newUser = new User({
                            contactEmail: profile.email, 
                            facebookId: profile.id,
                            displayName: profile.name,
                            avatar: 'https://graph.facebook.com/' + profile.id + '/picture?width=80&height=80',
                        });
                    newUser.save(function (err) {
                        if (err) {
                            return res.send(err);
                        } else {
                            return createSendToken(newUser, res);
                        }
                    });
                }
            });
        });
    });
});

router.post('/google', function (req, res) {
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
        
        if (err) { return res.send(err);}
        
        var accessToken = token.access_token,
            headers = {
                Authorization: 'Bearer ' + accessToken
            };
        externalRequest.get(apiUrl, {
            headers: headers,
            json: true
        }, function (err, response, profile) {
            
            if (err) {return res.send(err);}
            
            if (profile.error) {
                console.log(profile.error);
                return res.status(500).send('An Error Happened!!!');
            }
            
            User.getUser('googleId', profile.sub, function (err, foundUser) {
                
                if (err) {return res.send(err);}
                
                if (foundUser) {
                    
                    return createSendToken(foundUser, res);
                    
                } else {
                    
                    var newUser = new User({
                        googleId: profile.sub,
                        contactEmail: profile.email,
                        displayName: profile.name,
                        avatar: profile.picture
                    });
                    
                    newUser.save(function (err) {
                        if (err) {
                            return res.send(err);
                        } else {
                            createSendToken(newUser, res);
                        }
                    });
                }
            });
        });
    });
});

router.post('/github', function (req, res) {
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
        
        if (err) { return res.send(err);}
        
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
            
            if (err) {return res.send(err);}
            
            profile = JSON.parse(profile);
            
            if (profile.error) {
                console.log(profile.error);
                return res.status(500).send('An Error Happened!!!');
            }
            
            User.getUser('githubId', profile.id, function (err, foundUser) {
                
                if (err) {return res.send(err);}
                
                if (foundUser) {
                    
                    return createSendToken(foundUser, res);
                    
                } else {
                    
                    var newUser = new User({
                        githubId: profile.id,
                        displayName: profile.login,
                        avatar: profile.avatar_url
                    });
                    
                    if (profile.email) {
                        newUser.contactEmail = profile.email;
                    }
                    
                    newUser.save(function (err) {
                        if (err) {
                            return res.send(err);
                        } else {
                            createSendToken(newUser, res);
                        }
                    });
                }
            });
        });
    });
});

router.post('*', function(req, res) {
    res.status(400).notify('error', 'OAuth Provider not recognized by server. Please contact an admin.', 'OAuth provider not recognized.');
});

module.exports = router;