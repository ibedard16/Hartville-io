var jwt     = require('jsonwebtoken'),
    User    = require('../models/userSchema'),
    config  = require('../config');

module.exports = function (permission) {
    var returnedMiddleware = function (req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).send({
                name: 'TokenMissingError',
                message: 'jwt missing'
            });
        }
        
        var token = req.headers.authorization.split(' ')[1];
        
        jwt.verify(token, config.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                return res.status(401).send(err);
            }
            
            User.findOne({_id: decodedToken.sub}, function (err, foundUser) {
                if (err) {
                    console.log("error validating token" + JSON.stringify(err));
                    return res.status(401).send(err);
                }
                
                if (!foundUser) {
                    console.log('Oh holy crap, someone sent a jwt with an invalid user id!');
                    res.status(400).send({
                        name: 'UserIDNotFound',
                        message: 'User ID was not found in server'
                    });
                    throw new Error('User ID was not found in the server\'s database');
                }
                
                if (!foundUser.permissions[permission]) {
                    return res.status(403).send({
                        name: 'UserLacksPermission',
                        message: 'User is not allowed to perform action'
                    });
                }
                
                if (!decodedToken.perms.length === 0) {
                    if (foundUser.active) {
                        return res.status(403).send({
                            name: 'UserLacksPermission',
                            message: 'User is not allowed to perform action'
                        });
                    } else {
                        return res.status(401).send({
                            name: 'NeedEmailValidation',
                            message: 'User must validate email'
                        });
                    }
                }
                
                var JWTPerms = {};
                
                for (var i = 0; i<decodedToken.perms.length; i++) {
                    JWTPerms[decodedToken.perms[i]] = true;
                }
                
                if (!JWTPerms[permission]) {
                    return res.status(401).send({
                        name: 'TokenMissingPermission',
                        message: 'User is allowed to perform action but JWT is missing required permission'
                    });
                }
                
                if (decodedToken.name !== foundUser.displayName || decodedToken.pic !== foundUser.avatar) {
                    return res.status(403).send({
                        name: 'InvalidUserInfo',
                        message: 'Permissions lined up but server\'s user info did not match JWT'
                    });
                }
                
                req.user = foundUser;
                
                next();
            });
        });
    };
    
    return returnedMiddleware;
};