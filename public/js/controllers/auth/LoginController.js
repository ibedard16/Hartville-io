'use strict';
/*global app*/
app.controller('LoginController', ['$scope', '$auth', 'notification', 'dBox', 'userProfile', function ($scope, $auth, notification, dBox, userProfile) {

    function logInSuccess (serverResponse) {
        console.log(serverResponse);
        notification.info('You are now logged in!','Success');
        userProfile.update();
        dBox.close();
    }
    
    $scope.submit = function () {
        $auth.login({email: $scope.email, password: $scope.password }).then(logInSuccess);
    };
    
    $scope.authenticate = function (provider) {
        $auth.authenticate(provider).then(logInSuccess);
    };
}]);