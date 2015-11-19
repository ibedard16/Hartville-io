var jwt     = require('jsonwebtoken'),
    User    = require('../models/userSchema'),
    config  = require('../config');

module.exports = function (permission) {
    var returnedMiddleware = function (req, res, next) {
        if (!req.headers.authorization) {
            if (permission) {
                return res.status(401).notify('warning', 'You must sign in first.', 'Not Signed In');
            } else {
                req.user = null;
                return next();
            }
        }
        
        var token = req.headers.authorization.split(' ')[1];
        
        jwt.verify(token, config.JWT_SECRET, function (err, decodedToken) {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).notify('error', 'Your session has expired, please log in again.', 'Expired Session');
                } else {
                    return res.status(401).notify('error', 'Your session became invalid somehow. Please log out and log back in before trying again.', 'Invalid Sessions');
                }
            }
            
            User.getUser('_id', decodedToken.sub, function (err, foundUser) {
                if (err) {
                    console.log("error validating token" + JSON.stringify(err));
                    return res.status(401).notify('error', err);
                }
                
                if (!foundUser) {
                    console.log('Oh holy crap, someone sent a jwt with an invalid user id!');
                    res.status(400).notify('error', 'There are no records of you in our database. If you believe this to be an error, please contact an administrator.', 'User not Recognized');
                }
                
                if (!decodedToken.perms.length === 0) {
                    if (foundUser.active) {
                        return res.status(403).notify('warning', 'You do not have permission to perform this action.', 'User not Allowed');
                    } else {
                        return res.status(401).notify('warning', 'You must validate your email first.', 'User not Verified');
                    }
                }
                
                if (!permission || permission === "authenticated") {
                    req.user = foundUser;
                
                    return next();
                }
                
                if (!foundUser.permissions[permission]) {
                    return res.status(403).notify('warning', 'You do not have permission to perform this action.', 'User not Allowed');
                }
                
                var JWTPerms = {};
                
                for (var i = 0; i<decodedToken.perms.length; i++) {
                    JWTPerms[decodedToken.perms[i]] = true;
                }
                
                if (!JWTPerms[permission]) {
                    return res.status(403).notify('warning', 'Our records indicate you are allowed to perform this action, but your session does not. Please log out and log back in before trying again.', 'Invalid Session Permission');
                }
                
                if (decodedToken.name !== foundUser.displayName || decodedToken.pic !== foundUser.avatar) {
                    return res.status(403).notify('error', 'Invalid session. Please log out and log back in before trying again.', 'Invalid session.');
                }
                
                req.user = foundUser;
                
                next();
            });
        });
    };
    
    return returnedMiddleware;
};