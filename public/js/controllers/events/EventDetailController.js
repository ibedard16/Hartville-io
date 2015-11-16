/*global app*/
app.controller('EventDetailController', ['$scope', '$routeParams', 'Event', 'updatePageTitle', function($scope, $routeParams, Event, updatePageTitle){
	
	Event.get({id: $routeParams.id}, function (event) {
		$scope.event = event[0];
		updatePageTitle($scope.event.name.text);
	});
	
}]);