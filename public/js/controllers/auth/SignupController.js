'use strict';
/*global app*/
app.controller('SignupController', ['$rootScope', '$scope', '$auth', 'toastr', function ($rootScope, $scope, $auth, toastr) {
    
    $scope.submit = function () {
        $auth.signup({email: $scope.email, password: $scope.password, name: $scope.name}).then(function (serverResponse) {
            console.log(serverResponse);
            toastr.success('Please check your email to verify your account.','Account Created!');
            $rootScope.$broadcast('userUpdate');
            $rootScope.$broadcast('hideDialogueBox');
        });
    };
}]);