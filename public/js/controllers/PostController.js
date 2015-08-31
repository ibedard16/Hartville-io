app.controller('PostController', ['$scope', '$routeParams', '$filter', 'posts', function($scope, $routeParams, $filter, posts){
	posts.get({post:$routeParams.id}).then(function(data) {
		if (data.status == 404) {
			$scope.error = true;
		} else {
			$scope.post = data.post;
		}
	});
}]);