'use strict';
/*global app*/
app.controller('SignupController', ['$scope', 'authSendCredentials', function ($scope, authSendCredentials) {
    
    $scope.submit = function () {
        var redirect = '/';
        authSendCredentials.signup($scope.remember, $scope.email, $scope.password, redirect);
    };
}]);