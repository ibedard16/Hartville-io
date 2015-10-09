/*global app*/

app.directive('userDropdown', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/user/partials/user-dropdown.html',
		controller: ['$scope', '$rootScope', '$auth', function ($scope, $rootScope, $auth) {
            var loginInitialize = function () {
                if ($auth.isAuthenticated()) {
                    var payload = $auth.getPayload();
                    $scope.loggedIn = true;
                    $scope.menuName = payload.name;
                    $scope.avatar = payload.pic;
                    $scope.dropdown = [
                        {text: 'Profile', href: '/user'},
                        '',' ',
                        {divider: true},
                        {text: 'Logout', click: function () {
                            $rootScope.$broadcast('showDialogueBox', {boxType: 'logout'});
                        }}
                    ];
                    
                    for (var i = 0; i<payload.perms.length; i++) {
                        if (payload.perms[i] === 'canPost') {
                            $scope.dropdown[1] = {text: 'New Post', href: '/new'};
                        } else if (payload.perms[i] === 'setPermissions') {
                            $scope.dropdown[2] = {text: 'User Permissions', href: '/perms'};
                        }
                    }
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