/*global app*/
app.controller('PostController', ['$scope', '$routeParams', '$filter', 'Post', 'User', '$sce', function($scope, $routeParams, $filter, Post, User, $sce){
	Post.get({id:$routeParams.id}).$promise.then(function(data) {
		console.log(data);
		if (data.notification.type == 'error') {
			$scope.error = true;
			$scope.post = {};
			$scope.post.title = "404 error";
		} else {
			$scope.post = data;
			User.get({id:$scope.post.authorId}, function (data) {
    			$scope.author = data;
    		});
		}
	});
}]);