app.directive('websiteSidebar', ['$routeParams', 'User', 'Post', function ($routeParams, User, Post) {
	return {
		restrict: 		'E',
		templateUrl:	'js/directives/navigation/partials/website-sidebar.html',
		scope: {
        	authorId: '=authorId',
        	posts: '=posts'
    	},
    	link: function (scope, element) {
    		scope.$watch('authorId', function () {
    			if (!!scope.authorId) {
		    		User.get({id:scope.authorId}, function (data) {
		    			scope.author = data;
		    		});
    			}
    			Post.get({authorId:scope.authorId, limitTo:5}, function (data) {
	    			scope.posts = data.posts;
	    		});
    		});
    	}
	};
	
}]);