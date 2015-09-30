var mongoConnect = require('../database/databaseConnect'),
    Post = require('../models/postSchema');
    
console.log(Post.find)

/*var list = [],
    highestId,
    count,
    allposts = [];

Post.find(function(err, posts) {
    if (err) {
        console.log("Server cannot connect to database.");
    }
    else {
        console.log[posts];
        allposts = posts;
        console.log[allposts[1]];
        for(var i=0;i<posts.length;i++){
            if (list[posts[i].id]===undefined){
                list[posts[i].id] = posts[i];
            } else {
                console.log("2 posts have duplicate id values.");
            }
            if (posts[i].id>highestId) {
                highestId = posts[i].id;
            }
        }
        count = posts.length;
        //pagesUpdate();
    }
});

console.log(list[200]);

module.exports = {
    getId: function (id) {
        return list[id];
    },
    list: allposts,
    highestId: highestId,
    count: count
}; */