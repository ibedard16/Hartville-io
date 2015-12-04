var config = require('../config'),
    sass= require('node-sass'),
    express = require('express'),
    router = express.Router();

var sassString = '';
for (var color in config.client_config.colors) {
    sassString = sassString + color + ': ' + config.client_config.colors[color] + '; ';
}
sassString = sassString + "@import 'styles';";

var css;

try {
    css = sass.renderSync({
        data: sassString,
        includePaths: ['public/sass'],
        outputStyle: 'compressed'
    }).css.toString('utf8');
} catch (e) {
    console.log('Custom colors were configured improperly. Used default colors instead. Please check the formatting of each color.');
    css = sass.renderSync({
        data: "$colorBrand: #DB3A0D; $colorBrandLight: #E67556; $colorBrandDark: #AF2E0A; $colorAccent: #EF8813; $colorAccentLight: #F5B871; $colorAccentDark: #78440A;@import 'styles';",
        includePaths: ['public/sass'],
        outputStyle: 'compressed'
    }).css.toString('utf8');
}

router.get('*', function (req, res) {
    res.set('Cache-Control', 'max-age=1000').set({'content-type': 'text/css'}).send(css);
});

module.exports = router;