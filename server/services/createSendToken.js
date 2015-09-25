var jwt     = require('jwt-simple'),
    moment  = require('moment');

module.exports = function (user, response) {
    var payload = {
        //iss: request.hostname,
        sub: user.id,
        exp: moment().add(10, 'days').unix()
    };
    
    var token = jwt.encode(payload, 'shhh...');
    
    response.status(200).send({
        user: user.toJSON(), 
        token: token
    });
}