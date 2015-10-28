/*global app*/
/*global _*/
app.controller('EventsController', ['$scope', 'Event', function($scope, Event){
	Event.get(function (events) {
		$scope.events = {};
		$scope.events.upcoming = [];
		$scope.events.ongoing = [];
		$scope.events.past = [];
		var currentDate = new Date();
		for (var i = 0; i < events.length; i++) {
		    
		    if (currentDate < events[i].start) {
		        $scope.events.upcoming.push(events[i]);
		    } else if (currentDate < events[i].end) {
		        $scope.events.ongoing.push(events[i]);
		    } else {
		        $scope.events.past.push(events[i]);
		    }
		}
	});
}]);