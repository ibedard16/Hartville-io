'use strict';
/*global app*/
app.controller('SignupController', ['$scope', '$auth', 'dBox', function ($scope, $auth, dBox) {
    
    $scope.submit = function () {
        $auth.signup({email: $scope.email, password: $scope.password, name: $scope.name}).then(function (serverResponse) {
            dBox.close();
        });
    };
}]);