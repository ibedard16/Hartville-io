'use strict';
/*global app*/
app.controller('LoginController', ['$scope', 'authSendCredentials', function ($scope, authSendCredentials) {
    
    $scope.submit = function () {
        var redirect = '/';
        authSendCredentials.login($scope.remember, $scope.email, $scope.password, redirect);
    };
}]);