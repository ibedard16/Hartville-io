app.directive('websiteSidebar', ['$routeParams', function ($routeParams) {
	if ($routeParams.author) {
		return {
			restrict: 		'E',
			templateUrl:	'views/partials/navigation/website-sidebar-author.html'
		};
	} else {
		return {
			restrict: 		'E',
			templateUrl: 	'views/partials/navigation/website-sidebar-main.html'
		};
	}
}]);