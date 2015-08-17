app.controller('PagerController', ['$scope', 'posts', '$routeParams', function ($scope, posts, $routeParams) {
	
	posts.then(function(data) {
		$scope.posts = data.posts;
		$scope.content = $scope.posts[$routeParams.id];
	});
	
	$scope.posts = [];
	$scope.pageSize = 5;
	$scope.currentPage = 1;
	
}]); 