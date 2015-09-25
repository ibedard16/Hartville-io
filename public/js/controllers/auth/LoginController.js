'use strict';
/*global app*/
app.controller('LoginController', ['$rootScope','$scope', 'authSendCredentials', '$auth', 'toastr', function ($rootScope, $scope, authSendCredentials, $auth, toastr) {

    function logInSuccess (serverResponse) {
        toastr.success('You are now logged in!','Success');
        $rootScope.$broadcast('userUpdate');
        $rootScope.$broadcast('hideDialogueBox');
    }
    
    $scope.submit = function () {
        $auth.login({email: $scope.email, password: $scope.password }).then(logInSuccess);
    };
    
    $scope.authenticate = function (provider) {
        $auth.authenticate(provider).then(logInSuccess);
    };
}]);