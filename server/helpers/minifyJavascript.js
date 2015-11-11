var fs = require('fs');
var compressor = require('node-minify');
var config = require('../config');

var baseDirectory = __dirname.slice(0,-15);

function makeAppConfig (cb) {
    fs.writeFile(baseDirectory + '/public/js/appConfig.js', 'app.constant("appConfig", ' + JSON.stringify(config.client_config) + ');', cb);
}

function getVendorFiles (cb) {
    fs.readFile(baseDirectory + '/public/js/vendorFiles.txt', 'utf8', function (err, data) {
        if (err) {
            return cb(err);
        }
        data = data.split('\n');
        for (var i = 0; i < data.length; i++) {
            data[i] = 'public/vendor/' + data[i];
        }
        cb(null, data);
    });
}

function getFilesInDirectory (directory, cb) {
    var returnedFiles = [];
    fs.readdir(baseDirectory + '/' + directory, function (err, files) {
        if (err) {
            return cb(err);
        }
        
        var fileCount = files.length;
        
        var fileReadingCount = 0;
        
        for (var i = 0; i < fileCount; i++) {
            if (files[i].indexOf('.js') >= 0) {
                returnedFiles.push(directory + '/' + files[i]);
            } else {
                fileReadingCount += 1;
                getFilesInDirectory(directory + '/' + files[i], function (err, foundFiles) {
                    fileReadingCount -= 1;
                    if (err) {
                        if (err.code !== 'ENOTDIR') {
                            return console.log(err);
                        }
                    }
                    returnedFiles.push.apply(returnedFiles, foundFiles);
                    
                    if (i === fileCount & fileReadingCount === 0) {
                        cb(null, returnedFiles);
                    }
                });
            }
        }
        if (fileReadingCount === 0) {
            return cb(null, returnedFiles);
        }
    });
}

function minifyJavascript () {
    console.log("Javascript Being Minified");
    makeAppConfig(function (err) {
        if (err) {
            console.log(err);
        }
        getVendorFiles(function (err, vendorFiles) {
            if (err) {
                console.log(err);
            }
            getFilesInDirectory('public/js', function (err, files) {
                if (err) {
                    return console.log(err);
                }
                vendorFiles.push.apply(vendorFiles, files);
                new compressor.minify({
                    type: 'uglifyjs',
                    fileIn: vendorFiles,
                    fileOut: 'public/app.min.js',
                    callback: function(err, min){
                        if (err) {
                            console.log("Javascript Could not be Minified");
                            throw new Error (err);
                        }
                        min = '// Vendor Liscenses located @ ' + config.APP_URL + 'vendorLiscenses.txt\n\n' + min;
                        fs.writeFile(baseDirectory + '/public/app.min.js', min, function (err) {
                            if (err) {
                                throw new Error (err);
                            }
                           console.log("Javascript was Successfully Minified"); 
                        });
                    }
                });
            });
        });
    });
}

module.exports = minifyJavascript;