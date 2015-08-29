app.controller('PostController', ['$scope', '$routeParams', '$filter', 'posts', 'authors', 'events', function($scope, $routeParams, $filter, posts, authors, events){
	$scope.searchInput = '';

	posts.get({post:$routeParams.id}).then(function(data) {
		$scope.post = data.post;
	});
}]);