'use strict';
/*global app*/
app.controller('LogoutController', ['$rootScope', '$scope', '$auth', '$location', function ($rootScope, $scope, $auth, $location) {
    $scope.logout = function () {
        $auth.logout();
        $rootScope.$broadcast('userUpdate');
        $rootScope.$broadcast('hideDialogueBox');
    };
    $scope.cancel = function () {
        $rootScope.$broadcast('hideDialogueBox');
    };
}]);