/*global app*/

app.directive('websiteNavigation', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/navigation/partials/website-navigation.html',
		controller: ['$location', '$scope', function ($location, $scope) {
			$scope.$location = $location;
			$scope.isCollapsed = true;
			$scope.collapse = function () {
				if (!$scope.isCollapsed) {
					$scope.isCollapsed = true;
				}
			};
		}]
	};
});