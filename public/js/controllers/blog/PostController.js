/*global app*/
app.controller('PostController', ['$scope', '$routeParams', '$filter', 'Post', 'User', 'updatePageTitle', 'updatePageTitle', function($scope, $routeParams, $filter, Post, User, updatePageTitle){
	Post.get({id:$routeParams.id}).$promise.then(function(data) {
		console.log(data);
		if (data.notification) {
			if (data.notification.type == 'error') {
				$scope.error = true;
				$scope.post = {};
				$scope.post.title = '404 error';
				updatePageTitle('404 error');
			}
		} else {
			$scope.post = data;
			updatePageTitle($scope.post.title);
			User.get({id:$scope.post.authorId}, function (data) {
    			$scope.author = data;
    		});
		}
	});
}]);