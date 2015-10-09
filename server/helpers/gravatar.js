var req = require('request'),
    md5 = require("blueimp-md5").md5;
    
module.exports.getProfileByEmail = function (email) {
    var hash = md5(email),
        options = {
            url: 'https://www.gravatar.com/'+hash+'.json',
            headers: {
                'User-Agent': 'Hartville.io'
            }
        };
    
    req(options, function (error, response, body) {
        var token = JSON.parse(body).entry[0];
        
        return token;
    });
};

module.exports.getAvatarByEmail = function (email) {
    
    var hash = md5(email);
    
    return 'http://www.gravatar.com/avatar/'+hash+'?d=identicon';
    
};