'use strict';
/*global app*/
app.controller('ValidateEmailController', ['$location', '$routeParams', '$http', 'notification', function ($location, $routeParams, $http, notification) {
    
    if ($routeParams.token) {
        $http.post('/auth/verifyEmail', {token: $routeParams.token});
    }
    
    $location.path('/');
}]);