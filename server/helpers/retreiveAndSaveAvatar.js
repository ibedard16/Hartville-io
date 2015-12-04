var externalRequest = require('request'),
    fs = require("fs"),
    config = require("../config");

const Imagemin = require('imagemin');

function retreiveAndSaveAvatar (url, userId, cb) {
    
    externalRequest.head(url, function(err, res, body){
        if (err) {
            return cb(err);
        }
        
        var fileExtension = '';
        if (res.headers['content-type'].indexOf('image/') === 0) {
            fileExtension = res.headers['content-type'].split('/')[1];
            console.log(fileExtension);
        } else {
            return cb({notification: {type: "error", body: "User's profile picture in unrecognized format. Please contact an administrator."}});
        }
        
        var filename = 'userFiles/avatars/' + userId + '.' + fileExtension;
        
        externalRequest(url).pipe(fs.createWriteStream(config.baseDirectory + '/public/' + filename)).on('close', function (err) {
            if (err) {
                return cb(err);
            }
            var imageCompressor;
            switch (fileExtension) {
                case 'jpeg': 
                    imageCompressor = 'jpegtran';
                    break;
                case 'png': 
                    imageCompressor = 'optipng';
                    break;
                case 'gif':
                    imageCompressor = 'gifsicle';
                    break;
            }
            new Imagemin()
                .src(config.baseDirectory + '/public/' + filename)
                .dest(config.baseDirectory + '/public/userFiles/avatars')
                .use(Imagemin[imageCompressor]())
                .run(function (err, files) {
                    if (err) {
                        return cb(err);
                    }
                    return cb(null, filename);
                });
        });
    });
}

module.exports = retreiveAndSaveAvatar;