/*global app*/
app.factory('postResource', ['$resource', function($resource) {
    var Posts = $resource('resources/posts');
    return {
        get: function(params, success) {
            return Posts.get(params, success);
        },
        save: function(params, data, success) {
            return Posts.save(params,data,success);
        }
    };
}]);