/*global app*/

app.directive('websiteNavigation', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/navigation/partials/website-navigation.html',
		controller: ['$location', '$scope', 'authToken', function ($location, $scope, authToken) {
			$scope.$location = $location;
			$scope.isAuthenticated = function () {
				return authToken.isAuthenticated();
			};
			$scope.status = {
				isopen: false
			};
			$scope.isCollapsed = true;
			$scope.toggleDropdown = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
				$scope.status.isopen = !$scope.status.isopen;
			};
		}]
	};
});