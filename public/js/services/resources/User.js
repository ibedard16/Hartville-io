/*global app*/
app.factory('User', ['$resource', function($resource) {
    var User = $resource('/resources/user', {}, {
        'get': {
            cache: true
        }
    });
    return User;
}]);