app.controller('MainController', ['$scope', '$routeParams', '$filter', 'posts', 'events', function($scope, $routeParams, $filter, posts, events){
	//Posts
	posts.get({main:true}).then(function(data) {
		if ($routeParams.author) {
			$scope.posts = $filter('filter')(data.posts,{author: $routeParams.author});
		} else {
			$scope.mdPreview = data.mdPreview;
			$scope.smPreview = data.smPreview;
		}
	});
	//Events
	events.get().then(function(data){
		$scope.events = data.events;
	});
}]);