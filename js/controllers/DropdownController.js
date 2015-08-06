app.controller("DropdownController", function ($scope, $log) {
	$scope.items = [
		'Profile',
		'New Post',
		'Log Out'
	];
	  
	$scope.status = {
		isopen: false
	};
	
	$scope.toggled = function(open) {
		$log.log('Dropdown is now: ', open);
	};
	
	$scope.toggleDropdown = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};
});