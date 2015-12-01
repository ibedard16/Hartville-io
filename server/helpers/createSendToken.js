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
    
    var expire = 604800;
    
    if (user.permissions.canPost) {
        expire = 259200;
    }
    if (user.permissions.setPermissions) {
        expire = 86400;
    }
    
    var payload = {
        perms: permissions,
        sub: user._id
    };
    
    var token = jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: expire
    });
    
    res.status(200).send({
        token: token
    });
};