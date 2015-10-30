/*global app*/
app.factory('Post', ['$resource', function($resource) {
    var Post = $resource('resources/posts');
    return Post;
}]);