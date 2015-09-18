/*global app*/

app.directive('userDropdown', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/user/partials/user-dropdown.html',
		controller: ['$scope', function ($scope) {
            var loginInitialize = function () {
                if ($scope.isAuthenticated()) {
                    $scope.menuName = 'UserName';
                    $scope.dropdown = [
                        {text: 'Profile', href: '/user'},
                        {text: 'New Post', href: '/new'},
                        {divider: true},
                        {text: 'Logout', href: '/logout'}
                    ];
                }
                else {
                    $scope.menuName = 'Get Involved';
                    $scope.dropdown = [
                        {text: 'Sign Up', href: 'signup'},
                        {text: 'Log In', href: 'login'}
                    ];
                }
            };
            loginInitialize();
            $scope.$on('userUpdate', function(event) {
                loginInitialize();
            });
        }]
	};
});