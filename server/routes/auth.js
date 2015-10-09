var User = require('../models/userSchema'),
    emailVerification = require('../helpers/emailVerification'),
    createSendToken = require('../helpers/createSendToken'),
    config = require('../config'),
    express = require("express"),
    gravatar = require("../helpers/gravatar"),
    router = express.Router();
    
router.post('/verifyEmail', function (req, res) {
    emailVerification.handler(req, res);
});

router.post('/login', function(req, res) {
    var email = req.body.email,
        password = req.body.password;
        
    User.getUser('loginEmail', email, function (err, user) {
        if (err) return res.status(500).send(err);
        
        if (!user) {
            return res.status(400).send('Email not Found');
        }
        
        user.comparePasswords(password, function (err, isMatch) {
            if (err) return res.status(500).send(err);
            
            if (!isMatch) {
                return res.status(400).send('Invalid Login');
            } 
            
            createSendToken(user, res);
        });
    });
});

router.post("/signup", function (req, res) {
    
    var email = req.body.email,
        name = req.body.name,
        password = req.body.password;
    
    User.getUser('loginEmail', email, function (err, user) {
        if (err) return res.status(500).send(err);
        
        if (user) return res.status(400).send('Email Already in Use');
        
        var avatar = gravatar.getAvatarByEmail(email);
        
        var newUser = new User({
            avatar: avatar,
            displayName: name,
            loginEmail: email,
            contactEmail: email,
            password: password,
            active: false
        });
    
        newUser.save(function (err) {
            if (err) {
                return res.status(500).send(err);
            } else {
                emailVerification.send(email);
                res.send('success');
            }
        });
    });
});

module.exports = router;