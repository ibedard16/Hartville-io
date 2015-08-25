app.controller("DropdownController",['$scope', function ($scope) {
	$scope.status = {
		isopen: false
	};
	$scope.isCollapsed = true;
	$scope.toggleDropdown = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};
}]);