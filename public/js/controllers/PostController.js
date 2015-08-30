app.controller('PostController', ['$scope', '$routeParams', '$filter', 'posts', 'authors', 'events', function($scope, $routeParams, $filter, posts, authors, events){
	posts.get({post:$routeParams.id}).then(function(data) {
		if (data.status == 404) {
			$scope.error = true;
		} else {
			$scope.post = data.post;
		}
	});
}]);