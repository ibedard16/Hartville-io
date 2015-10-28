/*global app*/
app.controller('BlogController', ['$scope', 'Post', '$http', function($scope, Post, $http){
	$scope.searchInput = '';
	$scope.pageSize = 5;
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	
	$scope.$watch('currentPage', function (newVal,oldVal) {
		Post.get({limitTo:$scope.pageSize, skip:($scope.currentPage - 1)*$scope.pageSize}, function(data) {
			$scope.posts = data.posts;
			$scope.postCount = Number(data.postCount);
		});
	});
}]);