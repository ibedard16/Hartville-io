/*global app*/
app.controller('AuthorController', ['$scope', '$routeParams', 'Post', '$http', function($scope, $routeParams, Post, $http){
	$scope.pageSize = 5;
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	
	$http.get('/resources/user',{params:{id:$routeParams.author}}).then(function (response) {
		$scope.user = response.data;
		
		if (!$scope.user.bio) {
			$scope.user.bio = "<p>This user hasn't told us anything about themselves yet!</p>";
		}
	});
	
	$scope.$watch('currentPage', function (newVal,oldVal) {
		var query = {
			authorId: $routeParams.author
		};
		Post.get({limitTo:$scope.pageSize, skip:($scope.currentPage - 1)*$scope.pageSize, query:query}, function(data) {
			$scope.posts = data.posts;
			$scope.postCount = Number(data.postCount);
		});
	});
}]);