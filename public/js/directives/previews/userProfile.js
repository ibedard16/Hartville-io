app.directive('userProfile', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/userProfile.html',
		scope: {
            author: '=author'
        },
	};
});