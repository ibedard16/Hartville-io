/*global app*/
app.controller('MainController', ['$scope', '$routeParams', '$filter', 'posts', 'events', 'postResource', function($scope, $routeParams, $filter, posts, events, postResource){
	//Posts
	/*posts.get({main:true}).then(function(data) {
		$scope.mdPreview = data.mdPreview;
		$scope.smPreview = data.smPreview;
	});*/
	var post = postResource.get({main: true}, function() {
		$scope.mdPreview = post.mdPreview;
		$scope.smPreview = post.smPreview;
	});
	//Events
	events.get().then(function(data){
		$scope.events = data.events;
	});
	
}]);