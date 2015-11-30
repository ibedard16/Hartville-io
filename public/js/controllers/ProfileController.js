/*global app*/

app.controller('ProfileController', ['$location', '$auth', '$scope', '$http', 'userProfile', 'User', 'dBox', 'notification', 'pageRestriction', function ($location, $auth, $scope, $http, userProfile, User, dBox, notification, pageRestriction) {
    pageRestriction();
    
    User.get({id:userProfile.info.sub}, function (response) {
        $scope.user = response;
        console.log($scope.user);
    });
    
    function bindingSuccess (serverResponse) {
        console.log(serverResponse);
        notification.info('Your account has been bound','Success');
        userProfile.update();
        dBox.close();
    }
    
    $scope.authenticate = function (provider) {
        $auth.authenticate(provider).catch(function (serverResponse) {
            $scope.user[provider.slice(0, -6) + 'Bound'] = true;
        });
    };
    
    $scope.unbind = function (provider) {
        dBox.getConfirmation('Are you sure? You will not be able to log in with ' + provider + ' anymore.', function () {
            User.save({unbind: provider}, {}, function (response) {
                $scope.user[provider + 'Bound'] = false;
                $scope.$apply();
            });
        });
    };
    
    $scope.submit = function () {
        User.save({}, {user: $scope.user}, function (response) {
            console.log(response);
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
            $location.path('/');
            notification.info('Changes were discarded.');
        });
    };
}]);