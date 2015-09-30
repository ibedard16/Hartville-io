/*global app*/
app.controller('HomeController', ['$scope', '$routeParams', '$filter', 'posts', 'events', 'postResource', function($scope, $routeParams, $filter, posts, events, postResource){
	//Posts
	/*posts.get({main:true}).then(function(data) {
		$scope.mdPreview = data.mdPreview;
		$scope.smPreview = data.smPreview;
	});*/
	postResource.get({limitTo: 6}, function(data) {
		$scope.posts = data.posts;
	});
	//Events
	events.get().then(function(data){
		$scope.events = data.events;
	});
	
}]);