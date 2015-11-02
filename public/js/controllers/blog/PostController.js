/*global app*/
app.controller('PostController', ['$scope', '$routeParams', '$filter', 'Post', 'User', '$sce', function($scope, $routeParams, $filter, Post, User, $sce){
	Post.get({id:$routeParams.id}).$promise.then(function(data) {
		if (data.status == 404) {
			$scope.error = true;
		} else {
			$scope.post = data;
			User.get({id:$scope.post.authorId}, function (data) {
    			$scope.author = data;
    		});
		}
	});
	
	$scope.deliberateTrust = function (html) {
		return $sce.trustAsHtml(html);
	};
}]);