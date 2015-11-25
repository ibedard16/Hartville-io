app.directive('userName', ['User', function (User) {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/userName.html',
		scope: {
            userId: '=userId'
        },
        link: function (scope) {
        	function updateUser () {
        	    User.get({id:scope.userId}, function (data) {
        			scope.user = data;
        		});
        	}
        	
        	if (!scope.userId) {
        	    scope.$watch('userId', updateUser);
        	} else {
        	    updateUser();
        	}
			
        }
	};
}]);