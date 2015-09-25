var req = require('request'),
    qs = require('querystring'),
    User = require('./../database/userSchema'),
    createSendToken = require('./createSendToken'),
    config = require('./config');

module.exports = function (request, response) {
    var accessTokenUrl  = 'https://graph.facebook.com/oauth/access_token',
        graphApiUrl     = 'https://graph.facebook.com/me',
        params          = params = {
            client_id: request.body.clientId,
            redirect_uri: request.body.redirectUri,
            code: request.body.code,
            grant_type: 'authorization_code',
            client_secret: config.FACEBOOK_SECRET
        };
    
    req.get({
        url: accessTokenUrl,
        qs: params
    }, function (err, res, accessToken) {
        if (err) return response.send(err);
        
        accessToken = qs.parse(accessToken);
        
        req.get({url: graphApiUrl, qs: accessToken, json: true}, function (err, res, profile) {
            if (err) return response.send(err);
            console.log(profile);
            User.findOne({facebookId: profile.id}, function (err, existingUser) {
                if (err) return response.send(err);
                if (existingUser) {
                    return createSendToken(existingUser, response);
                } else {
                    var newUser = new User({
                            facebookId: profile.id,
                            displayName: profile.name
                        });
                    newUser.save(function (err) {
                        if (err) {
                            return response.send(err);
                        } else {
                            return createSendToken(newUser, response);
                        }
                    });
                }
            });
        });
    });
};