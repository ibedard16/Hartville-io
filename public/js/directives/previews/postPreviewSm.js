/*global app*/
app.directive('postPreviewSm', ['User', function (User) {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/postPreviewSm.html',
		scope: {
            post: '=post',
        },
        link: function (scope) {
			User.get({id:scope.post.authorId}, function (data) {
    			scope.author = data;
    		});
        }
	};
}]);