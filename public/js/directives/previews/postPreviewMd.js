/*global app*/
app.directive('postPreviewMd', ['User', function (User) {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/postPreviewMd.html',
		scope: {
            post: '=post'
        },
        link: function (scope) {
			User.get({id:scope.post.authorId}, function (data) {
    			scope.author = data;
    		});
        }
	};
}]);