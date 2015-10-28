/*global app*/
app.controller('HomeController', ['$scope', 'Event', 'Post', function($scope, Event, Post){
	//Posts
	Post.get({limitTo: 6}, function(data) {
		$scope.posts = data.posts;
	});
	//Events
	Event.get(function (events) {
		console.log(events);
		$scope.events = events;
	});
}]);