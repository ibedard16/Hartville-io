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
    
    var token = jwt.sign(payload, config.JWT_SECRET, {noTimestamp:true});
    
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
    function activateUser (user) {
        user.active = true;
                    
        user.save(function(err) {
            if (err) {
                console.log(err);
                return res.status(500);
            } else {
                return res.notify('success', 'You may now log in.', 'Account Verified');
            }
        });
    }
    
    var token = req.body.token;
    
    console.log(token);
    
    jwt.verify(token, config.JWT_SECRET, function (err, decodedToken) {
        if (err) {
            console.log(err);
            return handleError(res);
        }
    
        var email = decodedToken.sub;
        
        console.log(email);
        
        if (!email) {
            console.log('missing email');
            return handleError(res);
        }
        
        User.findOne({loginEmail: email}, function (err, foundUser) {
            if (err) {
                console.log(err);
                return res.status(500);
            }
            
            if (!foundUser) {
                handleError(res);
            }
            
            if (!foundUser.active) {
                console.log(foundUser.activateBy);
                console.log(Date.now());
                if (foundUser.activateBy <= Date.now()) {
                    foundUser.remove();
                    return res.notify('error', 'You waited more than 5 days to activate your account, so your account information was deleted from our records. You must re-create your account in order to log in.', 'Expired Account');
                } else {
                    return activateUser(foundUser);
                }
            } else {
                res.notify('warning', 'You have already verefied your account. You may log in now.', 'Email Already Verified');
            }
        });
    });
};

function handleError(response) {
    return response.status(401).notify("error", "Something went wrong with the verification process. Please contact an admin if you believe this to be an error.", "Verification Error");
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