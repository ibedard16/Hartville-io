/*global app*/
/*global angular*/
app.factory('User', ['$resource', '$cacheFactory', function($resource, $cacheFactory) {
    var User = $resource('/resources/user', {}, {
        'get': {
            cache: true
        }
    }),
        $httpDefaultCache = $cacheFactory.get('$http');
    return angular.extend(User, {
        getBypassCacheForId: function (perm1, perm2, perm3) {
            $httpDefaultCache.remove('/resources/user?id=' + perm1.id);
            User.get(perm1,perm2,perm3);
        }
    });
}]);