'use strict';
/*global app*/
app.controller('LoginController', ['$scope', 'authSendCredentials', function ($scope, authSendCredentials) {
    console.log('LoginController initiallized');
    
    $scope.submit = function () {
        var redirect = '/';
        authSendCredentials.login($scope.remember, $scope.email, $scope.password, redirect);
    };
    
    $scope.google = function () {
        var redirect='/';
        authSendCredentials.googleAuth($scope.remember, redirect);
    };
}]);