app.controller('PostController', ['$scope', '$routeParams', '$filter', 'posts', 'authors', 'events', function($scope, $routeParams, $filter, posts, authors, events){
	posts.get({post:$routeParams.id}).then(function(data) {
		console.log(JSON.stringify(data));
		if (data.status == 404) {
			$scope.error = true;
			console.log($scope.error);
		} else {
			$scope.post = data.post;
		}
	});
}]);