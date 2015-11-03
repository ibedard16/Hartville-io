/*global app*/
app.controller('BlogController', ['$scope', 'Post', '$http', function ($scope, Post, $http) {
	var searchQuery = {};
	
	$scope.pageSize = 5;
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	
	function updatePosts () {
		Post.get({limitTo:$scope.pageSize, skip:($scope.currentPage - 1)*$scope.pageSize, query:searchQuery}, function(data) {
			$scope.posts = data.posts;
			$scope.postCount = Number(data.postCount);
		});
	}
	
	$scope.$watch('currentPage', function (newVal,oldVal) {
		updatePosts();
	});
	
	$scope.search = function () {
		if ($scope.searchInput !== "" && $scope.searchInput !== " ") {
			searchQuery = {'$text':{'$search': $scope.searchInput}};
			$scope.currentPage = 1;
			updatePosts();
			$( "input" ).blur();
		} else {
			searchQuery = {};
			$scope.currentPage = 1;
			updatePosts();
			$( "input" ).blur();
		}
	};
}]);