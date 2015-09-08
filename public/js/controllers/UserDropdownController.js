app.controller("UserDropdownController",['$scope', function ($scope) {
	$scope.dropdown = [
    {text: 'New Post', href: '/new'},
    {divider: true},
    {text: 'Login', href: '/login'}
  ];
}]);