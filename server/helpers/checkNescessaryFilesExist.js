var fs = require('fs'),
    config = require('../config');

module.exports = function () {
    function checkFilesExist (files) {
        
        fs.stat(files[0], function (err, stats) {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.mkdir(files[0], function (err) {
                        if (err) {
                            throw new Error (err);
                        }
                        if (files.length !== 1) {
                            checkFilesExist(files.slice(1));
                        }
                    });
                } else {
                    throw new Error(err);
                }
            } else {
                if (files.length !== 1) {
                    checkFilesExist(files.slice(1));
                }
            }   
        });
    }
    
    checkFilesExist([config.baseDirectory + '/public/postFiles', config.baseDirectory + '/public/userFiles', config.baseDirectory + '/public/userFiles/avatars']);
};