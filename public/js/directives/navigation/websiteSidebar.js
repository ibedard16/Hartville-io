app.directive('websiteSidebar', ['$routeParams', function ($routeParams) {
	return {
		restrict: 		'E',
		templateUrl:	'js/directives/navigation/partials/website-sidebar.html',
		scope: {
        	author: '=author',
        	posts: '=posts'
    	},
	};
}]);