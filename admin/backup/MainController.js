angular.module('Hartville_io').controller(
	'MainController', ['$scope',function($scope){
		$scope.navbar = [
		{
			display:"home",
			url:"#/",
		},
		{
			display:"about",
			url:"#/blog/3",
		},
		{
			display:"blog",
			url:"#/blog/",
		},
		{
			display:"spotlight",
			url:"#/spotlight/",
		},
		{
			display:"events",
			url:"#/events/",
		},
		{
			display:"community",
			url:"#/community/",
		},
        ];
	}]);