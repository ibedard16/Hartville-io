/*global app*/

app.controller('ProfileController', ['$location', '$auth', '$scope', '$http', 'userProfile', 'User', 'dBox', 'notification', 'pageRestriction', function ($location, $auth, $scope, $http, userProfile, User, dBox, notification, pageRestriction) {
    pageRestriction();
    
    userProfile.watch(function () {
        $scope.user = userProfile.info;
    });

    $scope.authenticate = function (provider) {
        $auth.authenticate(provider).catch(function (serverResponse) {
            userProfile.update();
        });
    };
    
    $scope.unbind = function (provider) {
        dBox.getConfirmation('Are you sure? You will not be able to log in with ' + provider + ' anymore.', function () {
            User.save({unbind: provider}, {}, function (response) {
                userProfile.update();
            });
        });
    };
    
    $scope.submit = function () {
        User.save({}, {user: $scope.user}, function (response) {
            userProfile.update();
            $location.path('/');
            
        });
    };
    
    $scope.bindImage = function(file, dest) {
		var	reader = new FileReader();
		reader.onload = function(e){
			$scope.user.newAvatar = e.target.result;
			$scope.$apply();
		};
		reader.readAsDataURL(file);
	};
    
    $scope.cancel = function () {
        dBox.getConfirmation('Any changes you made will not be saved.', function () {
            notification.info('Changes were discarded.');
            $location.path('/');
        });
    };
}]);