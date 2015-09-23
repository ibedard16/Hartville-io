'use strict';
/*global app*/
app.controller('LogoutController', ['$rootScope', 'authToken', '$location', function ($rootScope, authToken, $location) {
    authToken.removeToken();
    $rootScope.$broadcast('userUpdate',{test: 'test'});
    $location.path('/');
}]);