var User = require('../models/userSchema'),
    emailVerification = require('../helpers/emailVerification'),
    createSendToken = require('../helpers/createSendToken'),
    config = require('../config'),
    express = require("express"),
    gravatar = require("../helpers/gravatar"),
    retreiveAndSaveAvatar = require("../helpers/retreiveAndSaveAvatar"),
    moment = require('moment'),
    router = express.Router();
    
router.post('/verifyEmail', function (req, res) {
    emailVerification.handler(req, res);
});

router.post('/login', function(req, res) {
    var email = req.body.email,
        password = req.body.password;
        
    User.getUser('loginEmail', email, function (err, user) {
        if (err)  {
            if (err === 'MissingSearchValue') {
                return res.status(400).notify('warning', 'Email was not provided to login.', 'Missing Email');
            } else {
                return res.status(500).notify('error', err);
            }
        }
        
        if (!user) {
            return res.status(400).notify('error', 'Your email was not found in our records. Do you even have an account?', 'Email not Recognized');
        }
        
        if (!user.active) {
            return res.status(401).notify('warning', 'You must validate your email before you can log in.', 'Email not Validated');
        }
        
        user.comparePasswords(password, function (err, isMatch) {
            if (err) return res.status(500).notify('error', err);
            
            if (!isMatch) {
                return res.status(400).notify('error', 'Email/Password combination is incorrect.', 'Email/Password Mismatch');
            } 
            
            createSendToken(user, res);
        });
    });
});

router.post("/signup", function (req, res) {
    
    if (config.disAllowSignup) {
        return res.status(501).notify('warning', 'Signup is currently disabled. Why? Because the admin says so! (That, and there\'s no point in signing up for something you can\'t do anything on.)', 'Sign Up Disabled');
    }
    
    var email = req.body.email,
        name = req.body.name,
        password = req.body.password;
        
    function saveUser () {
        var newUser = new User({
            displayName: name,
            loginEmail: email,
            contactEmail: email,
            password: password,
            active: false,
            activateBy: moment().add(5, 'days').toDate()
        }),
            avatar = gravatar.getAvatarByEmail(email);
            
        retreiveAndSaveAvatar(avatar, newUser._id, function (err, filename) {
            if (err) {
                return res.status(500).send(err);
            }
            
            newUser.avatar = filename;
            
            newUser.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).notify('error', err);
                } else {
                    emailVerification.send(email);
                    res.notify('success', 'You have successfully signed up. To finish the process, please check your email to validate your account.', 'Success');
                }
            });
        });
    }
    
    function getUserByName (callback) {
        User.getUser('displayName', name, function (err, user) {
            if (err)  {
                if (err === 'MissingSearchValue') {
                    return res.status(400).notify('warning', 'Username was not provided to sign up.', 'Missing Email');
                } else {
                    return res.status(500).notify('error', err);
                }
            }
            
            if (user) {
                if (user.active) {
                    return res.status(400).notify('warning', 'The username you provided is already in use.', 'Username in Use');
                } else if (Date.now() < user.activateBy){
                    return res.status(400).notify('warning', 'The username you provided is already in use.', 'Username in Use');
                } else {
                    user.remove(function (err) {
                        if (err) {
                            return res.status(400).notify('warning', 'The username you provided is already in use.', 'Username in Use');
                        } else {
                            callback();
                        }
                    });
                }
            }
            
            callback();
        });
    }
    function getUserByEmail (callback) {
        User.getUser('loginEmail', email, function (err, user) {
            if (err)  {
                if (err === 'MissingSearchValue') {
                    return res.status(400).notify('warning', 'Email was not provided to sign up.', 'Missing Email');
                } else {
                    return res.status(500).notify('error', err);
                }
            }
            
            if (user) {
                if (user.active) {
                    return res.status(400).notify('warning', 'The email you provided is already in use.', 'Email in Use');
                } else if (Date.now() < user.activateBy){
                    return res.status(400).notify('warning', 'The email you provided is already in use.', 'Email in Use');
                } else {
                    return user.remove(function (err) {
                        if (err) {
                            return res.status(400).notify('warning', 'The email you provided is already in use.', 'Email in Use');
                        }
                        callback();
                    });
                }
            }
            
            callback();
        });
    }
    
    function signUp () {
        getUserByEmail(function () {
            getUserByName(function () {
                saveUser();
            });
        });
    }
    
    signUp();
});

module.exports = router;