var _               = require('lodash'),
    jwt             = require('jwt-simple'),
    config          = require('./config'),
    nodemailer      = require('nodemailer'),
    smtpTransport   = require('nodemailer-smtp-transport'),
    fs              = require('fs'),
    User            = require('../models/userSchema');
    
var model = {
    verifyUrl: config.APP_URL + 'auth/verifyEmail?token=',
    title: 'Hartville.io',
    subTitle: 'Thanks for Signing up!',
    body: 'Please verify your email address by clicking the button below'
};

var transporter = nodemailer.createTransport(smtpTransport(config.EMAIL_SENDER));

exports.send = function (email) {
    var payload = {
        sub: email
    };
    
    var token = jwt.encode(payload, config.EMAIL_SECRET);
    
    getHtml(token, function (err, data) {
        if (err) throw new Error(err);
        
        var mail = {
            from: "Hartville.io",
            to: email,
            subject: "Hartville.io Verification Email",
            //text: data,
            html: data
        };
        
        if (config.actuallySendEmail) {
            transporter.sendMail(mail, function(error, response){
                if(error){
                    throw new Error(error);
                }else{
                    console.log("Message sent: " + response.message);
                }
            });
        } else {
            console.log(mail);
        }
    });
};

exports.handler = function (request, response) {
    var token = request.query.token,
        payload = jwt.decode(token, config.EMAIL_SECRET),
        email = payload.sub;
        
    if (!email) return handleError(response);
    
    User.findOne({email: email}, function (err, foundUser) {
        if (err) return response.status(500);
        
        if (!foundUser) return handleError(response);
        
        if (!foundUser.active) {
            foundUser.active = true;
            
            foundUser.save(function(err) {
                if (err) return response.status(500);
                
                return response.redirect(config.APP_URL);
            });
        }
    });
};

function handleError(response) {
    return response.status(401).send({
        message: 'Authentication failed, unable to verify the email'
    });
}

function getHtml (token, callback) {
    try {
        var path        = 'server/views/emailVerification.html';
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) throw new Error(err);
            var template = _.template(data);
            
            model.verifyUrl += token;
            
            callback(null, template(model));
        });
    } catch (err) {
        callback(err);
    }
}

_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;