var express = require('express'),
    config = require('../config'),
    Post = require('../models/postSchema'),
    router = express.Router();

router.get('*', function (req, res) {
    console.log('hi');
    var mapString = "",
        baseUrl = config.APP_URL;
    
    mapString = mapString + baseUrl + '\r';
    mapString = mapString + baseUrl + 'blog/' + '\r';
    mapString = mapString + baseUrl + 'events/' + '\r';
    mapString = mapString + baseUrl + 'spotlight/' + '\r';
    mapString = mapString + baseUrl + 'community/' + '\r';
    mapString = mapString + baseUrl + 'about/' + '\r';
    Post.find(function (err, posts) {
        if (err) {
            return res.send(err);
        }
        for (var i = 0; i < posts.length; i++) {
            mapString = mapString + baseUrl + 'blog/post/' + posts[i].id + '\r';
        }
        res.set('content-type', 'text/plain').send(mapString);
    });
});

module.exports = router;