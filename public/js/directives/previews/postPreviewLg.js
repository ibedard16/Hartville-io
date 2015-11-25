app.directive('postPreviewLg', ['User', function (User) {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/postPreviewLg.html',
		scope: {
            post: '=post'
        },
        link: function (scope) {
        	if (!scope.post) {
        		scope.post = {
        			author: {}
        		};
        	}
			User.get({id:scope.post.authorId}, function (data) {
    			scope.author = data;
    		});
        }
	};
}]);