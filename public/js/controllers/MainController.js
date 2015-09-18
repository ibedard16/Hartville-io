/*global app*/
app.controller('MainController', ['$scope', '$routeParams', '$filter', 'posts', 'events', 'postResource', function($scope, $routeParams, $filter, posts, events, postResource){
	//Posts
	/*posts.get({main:true}).then(function(data) {
		$scope.mdPreview = data.mdPreview;
		$scope.smPreview = data.smPreview;
	});*/
	var post = postResource.get({page: 0}, function() {
		$scope.mdPreview = post.posts.slice(0,2);
		$scope.smPreview = post.posts.slice(2,6);
	});
	//Events
	events.get().then(function(data){
		$scope.events = data.events;
	});
	
}]);