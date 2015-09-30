/*global app*/
/*global _*/
app.controller('BlogController', ['$scope', '$routeParams', '$filter', 'postResource', 'authors', 'events', function($scope, $routeParams, $filter, postResource, authors, events){
	$scope.searchInput = '';
	$scope.pageSize = 5;
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	
	/*var postCount = postResource.get({number:true}, function () {
		$scope.postCount = postCount.postCount;
	});*/
	
	postResource.get({limitTo:10}, function(data) {
		$scope.recentPosts = data.posts;
	});
	
	$scope.$watch('currentPage', function (newVal,oldVal) {
		postResource.get({limitTo:$scope.pageSize, skip:($scope.currentPage - 1)*$scope.pageSize}, function(data) {
			$scope.posts = data.posts;
			$scope.postCount = Number(data.postCount);
			console.log(data);
		});
	});
	
	//Posts
	/*posts.get().then(function(data) {
		if ($routeParams.author) {
			$scope.posts = $filter('filter')(data.posts,{author: $routeParams.author});
		} else {
			$scope.posts = data.posts;
		}
	});*/
	
	//Authors
	authors.get().then(function(data){
		$scope.authors = data.authors;
		if ($routeParams.author) {
			$scope.author = _.find(data.authors, {name: $routeParams.author});
		} else {
			$scope.author = {name:"About Us", bio: "Mauris et dignissim condimentum, mi tellus auctor justo, sed lobortis lectus mauris id dolor. Morbi vulputate lectus eu eros volutpat, vel ullamcorper sapien rhoncus."};
		}
	});
	
	//Events
	events.get().then(function(data){
		$scope.events = data.events;
	});
	
	//$scope.posts = [];
}]);