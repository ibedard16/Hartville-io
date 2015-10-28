/*global app*/

app.controller('ProfileController', ['$location', '$scope', '$http', 'userProfile', 'User', 'dBox', 'notification', function ($location, $scope, $http, userProfile, User, dBox, notification) {
    User.get({id:userProfile.info.sub}, function (response) {
        $scope.user = response;
        console.log($scope.user);
    });
    
    $scope.submit = function () {
        User.save({}, {user: $scope.user}, function (response) {
            console.log(response);
        });
    };
    
    $scope.cancel = function () {
        dBox.getConfirmation('Any changes you made will not be saved.', function () {
            $location.path('/');
            notification.info('Changes were discarded.');
        });
    };
}]);