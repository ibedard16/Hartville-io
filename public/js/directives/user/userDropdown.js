/*global app*/

app.directive('userDropdown', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/user/partials/user-dropdown.html',
		controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
            var loginInitialize = function () {
                if ($scope.isAuthenticated()) {
                    $scope.loggedIn = true;
                    $scope.menuName = 'UserName';
                    $scope.dropdown = [
                        {text: 'Profile', href: '/user'},
                        {text: 'New Post', href: '/new'},
                        {divider: true},
                        {text: 'Logout', href: '/logout'}
                    ];
                }
                else {
                    $scope.loggedIn = false;
                }
            };
            
            $scope.showLogInMenu = function () {
                $rootScope.$broadcast('showDialogueBox', {boxType: 'login'});
            };
            
            loginInitialize();
            $scope.$on('userUpdate', function(event) {
                loginInitialize();
            });
        }]
	};
});