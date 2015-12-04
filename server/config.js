var defaultConfig   = require('./defaultConfig'),
    fs              = require('fs'),
    _               = require('lodash');
    
try {
    var customConfig = require('./customConfig');
    module.exports = _.defaultsDeep(customConfig, defaultConfig);
} catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
        fs.readFile(__dirname + '/defaultConfig.js', function (err, data) {
            if (err) {
                throw new Error('Cannot find default config.');
            }
            fs.writeFile(__dirname + '/customConfig.js', data, function (err) {
                if (err) {
                    throw new Error('Custom config was missing, so the server tried to make it.\nIt failed somehow.');
                }
                console.log('The server has created a custom config file at "server/customConfig.js". Please go in and change some of the properties, they\'re important for the server to run.');
            });
        });
    }
    module.exports = defaultConfig;
}

module.exports.baseDirectory = __dirname.split('/').slice(0,-1).join('/');