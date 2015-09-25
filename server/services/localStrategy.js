var User = require('./../database/userSchema'),
    LocalStrategy   = require('passport-local').Strategy,
    strategyOptions = {
        usernameField: 'email'
    };
    
exports.loginStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
    var searchUser = {
        email: email
    };
    User.findOne(searchUser, function (err, user) {
        if (err) return done(err);
        
        if (!user) {
            return done('Email not Found');
        }
        
        user.comparePasswords(password, function (err, isMatch) {
            if (err) return done(err);
            
            if (!isMatch) {
                return done('Invalid Login');
            } 
            
            return done(null, user);
            
        });
    });
});
    
exports.signupStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
    var searchUser = {
        email: email
    };
    User.findOne(searchUser, function (err, user) {
        if (err) {
            return done(err);
        }
        
        if (user) {
            return done('Email Already in Use');
        }
        
        
    
        var newUser = new User({
            email: email,
            password: password
        });
    
        newUser.save(function (err) {
            if (err) {
                return done(err);
            } else {
                done(null, newUser);
            }
        });
    });
});