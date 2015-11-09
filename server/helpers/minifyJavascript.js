var fs = require('fs');
var compressor = require('node-minify');

var baseDirectory = __dirname.slice(0,-15);

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
    getFilesInDirectory('public/js', function (err, files) {
        if (err) {
            return console.log(err);
        }
        new compressor.minify({
            type: 'yui-js',
            fileIn: files,
            fileOut: 'public/app.min.js',
            callback: function(err, min){
                if (err) {
                    console.log("Javascript Could not be Minified");
                    throw new Error (err);
                }
                console.log("Javascript was Successfully Minified");
            }
        });
    });
}

module.exports = minifyJavascript;