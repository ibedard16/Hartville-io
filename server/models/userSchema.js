var bcrypt = require('bcrypt-nodejs'),
    mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    loginEmail: String,
    contactEmail: String,
    password: String,
    googleId: String,
    githubId: String,
    facebookId: String,
    displayName: String,
    active: {
        type: Boolean,
        default: true
    },
    avatar: String,
    permissions: {
        canComment: {type: Boolean, default: true},
        canPost: {type: Boolean, default: false},
        setPermissions: {type: Boolean, default: false}
    },
    strikes: {
        type: Number,
        default: 0
    }
});

userSchema.methods.toJSON = function () {
    var user = this.toObject();
    delete user.password;
    return user;
};

userSchema.methods.comparePasswords = function (password, callback) {
    bcrypt.compare(password, this.password, callback);
};

var User = mongoose.model('User', userSchema);

User.getUser = function(fieldToSearch, searchValue, callback) {
    if (!callback) {
        throw new Error('callback is required');
    }
    
    if (!searchValue || !fieldToSearch) {
        callback('Needed value was missing.');
    } else {
        var searchObject = {};
        searchObject[fieldToSearch] = searchValue;
        User.findOne(searchObject, function (err, user) {
            
            if (err) {
                return callback(err);
            } else {
                return callback(null, user);
            }
            
        });
    }
};

userSchema.pre('save', function (next) {
    var user = this;
    
    if (!user.isModified('password')) {
        return next();
    }
    
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            
            user.password = hash;
            next();
        });
    });
});

module.exports = User;