app.config(['$routeProvider', '$locationProvider', function ($routeProvider,$locationProvider) {
	$locationProvider
		.html5Mode({
  			enabled: true,
  			requireBase: false
		});
		
	$routeProvider.caseInsensitiveMatch = true;
	
	$routeProvider
	.when('/', {
		title: 'Hartville.io | A Community For Technology',
		templateUrl: 'views/home.html',
		controller: 'BlogController' 
	})
	.when('/new', {
		title: 'Hartville.io | New Post',
		templateUrl: 'views/new.html',
	})
	.when('/blog', {
		title: 'Hartville.io | Blog',
		templateUrl: 'views/blog.html',
		controller: 'BlogController'
	})
	.when('/blog/post/:id', {
		title: 'Hartville.io | Blog',
		templateUrl: 'views/post.html',
		controller: 'BlogController'
	})
	.when('/blog/author/:author', {
		title: 'Hartville.io | Blog',
		templateUrl: 'views/blog.html',
		controller: 'BlogController'
	})
	.when('/blog/filter/:filter', {
		title: 'Hartville.io | Blog',
		templateUrl: 'views/blog.html',
		controller: 'BlogController'
	})
	.when('/about', {
		title: 'About',
		templateUrl: 'views/about.html',
		controller: 'BlogController'
	})
	.when('/spotlight', {
		title: 'Spotlight',
		templateUrl: 'views/spotlight.html',
		controller: 'BlogController'
	})
	.when('/community', {
		title: 'Community',
		templateUrl: 'views/community.html',
		controller: 'BlogController',
	})
	.when('/events', {
		title: 'Events',
		templateUrl: 'views/events.html',
		controller: 'BlogController',
	})
	.otherwise({
		title: '404 Error',
		templateUrl: 'views/404.html',
	});
}]);

//Adjusts page titles to match Route.title

app.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);