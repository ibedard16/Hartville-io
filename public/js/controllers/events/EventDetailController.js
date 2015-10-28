/*global app*/
/*global _*/
app.controller('EventDetailController', ['$scope', '$routeParams', '$rootScope', 'Event', function($scope, $routeParams, $rootScope, Event){
	
	Event.get({id: $routeParams.id}, function (event) {
		$scope.event = event[0];
		$rootScope.page_title = $scope.event.name.text;
	});
	
}]);