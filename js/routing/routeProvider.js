app.config(function ($routeProvider) {$routeProvider
	.when('/', {
		templateUrl: 'views/index.html',
	})
	.when('/new/', {
		templateUrl: 'views/new.html',  
	})
	.when('/blog/', {
		templateUrl: 'views/blog.html',
		controller: 'BlogController'
	})
	.when('/blog/:id', {
		templateUrl: 'views/post.html',
		controller: 'BlogController'
	})
	.when('/blog/filter/:filter', {
		templateUrl: 'views/blog.html',
		controller: 'BlogController'
	})
	.otherwise({
		templateUrl: 'views/404.html'
	});
});