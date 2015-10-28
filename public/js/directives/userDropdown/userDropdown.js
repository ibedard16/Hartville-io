/*global app*/

app.directive('userDropdown', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/userDropdown/partials/user-dropdown.html',
		controller: ['$scope', 'userProfile', 'dBox', function ($scope, userProfile, dBox) {
            $scope.showLogInMenu = function () {
                dBox.openBox('login');
            };
            
            userProfile.watch(function () {
                if (userProfile.loggedIn) {
                    $scope.loggedIn = true;
                    $scope.menuName = userProfile.info.name;
                    $scope.avatar = userProfile.info.pic;
                    $scope.dropdown = [
                        {text: 'Profile', href: '/profile'},
                        '',' ',
                        {divider: true},
                        {text: 'Logout', click: function () {
                            dBox.getConfirmation('Do you really want to log out?', function () {
                                userProfile.logout();
                            });
                        }}
                    ];
                    
                    for (var i = 0; i < userProfile.info.perms.length; i++) {
                        if (userProfile.info.perms[i] === 'canPost') {
                            $scope.dropdown[1] = {text: 'New Post', href: '/blog/newPost'};
                        } else if (userProfile.info.perms[i] === 'setPermissions') {
                            $scope.dropdown[2] = {text: 'User Permissions', href: '/perms'};
                        }
                    }
                }
                else {
                    $scope.loggedIn = false;
                }
            });
        }]
	};
});