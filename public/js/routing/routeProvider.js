app.config(['$routeProvider', '$locationProvider', function ($routeProvider,$locationProvider) {
	$locationProvider
		.html5Mode({
  			enabled: true,
  			requireBase: false
		});
		
	$routeProvider.caseInsensitiveMatch = true;
	
	$routeProvider
	.when('/', {
		pageTitle: 'Hartville.io | A Community For Technology',
		templateUrl: 'views/home.html',
		controller: 'BlogController' 
	})
	.when('/new', {
		pageTitle: 'Hartville.io | New Post',
		templateUrl: 'views/new.html',
	})
	.when('/blog', {
		pageTitle: 'Hartville.io | Blog',
		title: 'Blog',
		templateUrl: 'views/blog.html',
		controller: 'BlogController'
	})
	.when('/blog/post/:id', {
		pageTitle: 'Hartville.io | Blog',
		title: 'Blog',
		templateUrl: 'views/post.html',
		controller: 'BlogController'
	})
	.when('/blog/author/:author', {
		pageTitle: 'Hartville.io | Author',
		title: 'Blog',
		templateUrl: 'views/blog.html',
		controller: 'BlogController'
	})
	.when('/blog/filter/:filter', {
		title: 'Blog',
		templateUrl: 'views/blog.html',
		controller: 'BlogController'
	})
	.when('/about', {
		pageTitle: 'Hartville.io | About',
		title: 'About',
		templateUrl: 'views/about.html',
		controller: 'BlogController'
	})
	.when('/spotlight', {
		pageTitle: 'Hartville.io | Spotlight',
		title: 'Spotlight',
		templateUrl: 'views/spotlight.html',
		controller: 'BlogController'
	})
	.when('/community', {
		pageTitle: 'Hartville.io | Community',
		title: 'Community',
		templateUrl: 'views/community.html',
		controller: 'BlogController',
	})
	.when('/events', {
		pageTitle: 'Hartville.io | Events',
		title: 'Events',
		templateUrl: 'views/events.html',
		controller: 'BlogController'
	})
	.otherwise({
		title: '404 Error',
		templateUrl: 'views/404.html',
	});
}]);

//Adjusts page titles to match Route.title

app.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.pageTitle = current.$$route.pageTitle;
        $rootScope.title = current.$$route.title;
    });
}]);