var jwt     = require('jsonwebtoken'),
    moment  = require('moment'),
    config  = require('../config');

module.exports = function (user, res) {
    var permissions = [];
    
    user = (JSON.parse(JSON.stringify(user)));
    
    if (user.active) {
        for (var permission in user.permissions) {
            if (user.permissions.hasOwnProperty(permission)) {
                if (user.permissions[permission] === true) {
                    permissions.push(permission);
                }
            }
        }
    }
    
    var expire = 10080;
    
    if (user.permissions.canPost) {
        expire = 4320;
    }
    if (user.permissions.setPermissions) {
        expire = 1440;
    }
    
    var payload = {
        perms: permissions,
        name: user.displayName,
        pic: user.avatar,
        sub: user._id
    };
    
    var token = jwt.sign(payload, config.JWT_SECRET, {
        expiresInMinutes: expire
    });
    
    res.status(200).send({
        token: token
    });
};