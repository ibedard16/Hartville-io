var _               = require('lodash'),
    jwt             = require('jsonwebtoken'),
    config          = require('../config'),
    nodemailer      = require('nodemailer'),
    smtpTransport   = require('nodemailer-smtp-transport'),
    fs              = require('fs'),
    User            = require('../models/userSchema');
    
var model = {
    verifyUrl: config.APP_URL + 'validateemail?token=',
    title: 'Hartville.io',
    subTitle: 'Thanks for Signing up!',
    body: 'Please verify your email address by clicking the button below'
};

var transporter = nodemailer.createTransport(smtpTransport(config.EMAIL_SENDER));

exports.send = function (email) {
    var payload = {
        sub: email
    };
    
    var token = jwt.sign(payload, config.JWT_SECRET);
    
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

exports.handler = function (req, res) {
    var token = req.body.token;
    
    jwt.verify(token, config.JWT_SECRET, function (err, decodedToken) {
        if (err) {
            return res.status(401).send(err);
        }
    
        var email = decodedToken.sub;
        
        console.log(email);
        
        if (!email) return handleError(res);
        
        User.findOne({loginEmail: email}, function (err, foundUser) {
            if (err) return res.status(500);
            
            if (!foundUser) return handleError(res);
            
            if (!foundUser.active) {
                foundUser.active = true;
                
                foundUser.save(function(err) {
                    if (err) return res.status(500);
                });
            }
            return res.send('success');
        });
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