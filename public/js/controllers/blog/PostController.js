/*global app*/
app.controller('PostController', ['$scope', '$routeParams', '$filter', 'Post', 'User', 'userProfile', 'updatePageTitle', 'updatePageTitle', function($scope, $routeParams, $filter, Post, User, userProfile, updatePageTitle){
	Post.get({id:$routeParams.id}).$promise.then(function(data) {
		if (data.notification) {
			if (data.notification.type == 'error') {
				$scope.error = true;
				$scope.post = {};
				$scope.post.title = '404 error';
				updatePageTitle('404 error');
			}
		} else {
			$scope.post = data;
			updatePageTitle($scope.post.title, 'Blog');
			User.get({id:$scope.post.authorId}, function (data) {
				$scope.author = data;
			});
		}
	});
}]);