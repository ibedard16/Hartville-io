app.controller("UserDropdownController",['$scope', function ($scope) {
	$scope.dropdown = [
    {text: 'New Post', href: '/new/'},
    {divider: true},
    {text: 'Log out', href: '#'}
  ];
}]);