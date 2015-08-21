app.directive('websiteSidebar', ['$routeParams', function ($routeParams) {
	return {
		restrict: 		'E',
		templateUrl:	'views/partials/navigation/website-sidebar.html',
		scope: {
        	author: '=author',
        	posts: '=posts'
    	},
	};
}]);