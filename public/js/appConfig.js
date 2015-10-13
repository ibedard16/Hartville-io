/*global app*/

app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$authProvider', 'appConfig', function ($routeProvider,$locationProvider,$httpProvider,$authProvider,appConfig) {
	
	$locationProvider
		.html5Mode({
  			enabled: true,
  			requireBase: false
		});
		
	$routeProvider.caseInsensitiveMatch = true;
	
	$routeProvider
	.when('/', {
		pageTitle: appConfig.app_name,
		subtitle: appConfig.app_description,
		about: true,
		templateUrl: 'views/home.html',
		controller: 'HomeController'
	})
	.when('/new', {
		pageTitle: 'New Post',
		templateUrl: 'views/new.html',
		controller: 'NewController'
	})
	.when('/blog', {
		pageTitle: 'Blog',
		templateUrl: 'views/blog.html',
		controller: 'BlogController'
	})
	.when('/blog/post/:id', {
		pageTitle: 'Blog',
		templateUrl: 'views/post.html',
		controller: 'PostController'
	})
	.when('/blog/author/:author', {
		pageTitle: 'Author',
		templateUrl: 'views/user.html',
		controller: 'BlogController'
	})
	.when('/blog/filter/:filter', {
		pageTitle: 'Blog',
		templateUrl: 'views/blog.html',
		controller: 'BlogController'
	})
	.when('/about', {
		pageTitle: 'About',
		templateUrl: 'views/about.html',
		controller: 'BlogController'
	})
	.when('/spotlight', {
		pageTitle: 'Spotlight',
		templateUrl: 'views/spotlight.html',
		controller: 'BlogController'
	})
	.when('/community', {
		pageTitle: 'Community',
		templateUrl: 'views/community.html',
		controller: 'BlogController',
	})
	.when('/events', {
		pageTitle: 'Events',
		templateUrl: 'views/events.html',
		controller: 'BlogController'
	})
	.when('/events/event/:id', {
		pageTitle: 'Event',
		templateUrl: 'views/eventDetails.html',
		controller: 'BlogController'
	})
	.when('/signup', {
		pageTitle: 'Sign Up',
		templateUrl: 'views/signUp.html',
		controller: 'SignupController'
	})
	.when('/login', {
		pageTitle: 'Log In',
		templateUrl: 'views/login.html',
		controller: 'LoginController'
	})
	.when('/components', {
		templateUrl: 'views/components.html',
		controller: 'BlogController',
		pageTitle: 'Comment Test Page'
	})
	.when('/validateemail', {
		controller: 'ValidateEmailController',
		templateUrl: 'views/404.html'
	})
	.otherwise({
		templateUrl: 'views/404.html',
		pageTitle: '404 Error'
	});
	
	$httpProvider.interceptors.push('authIntercept');
	
	$authProvider.loginUrl = 'auth/login';
	$authProvider.signupUrl = 'auth/signup';
	
	var OAuth_providers = appConfig.OAuth_providers;
	
	for (var providerName in OAuth_providers) {
		
		var provider = OAuth_providers[providerName];
		
		provider.redirectUri = window.location.origin + '/auth' + providerName;
		
		$authProvider[providerName](provider);
	}
	
}]);

//Adjusts page titles to match Route.title

app.run(['$rootScope', 'appConfig', function($rootScope, appConfig) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        var route = current.$$route;
        
        $rootScope.pageTitle = appConfig.app_name + ' | ' + route.pageTitle;
        
        if (appConfig.app_name === route.pageTitle) {
        	$rootScope.pageTitle = appConfig.app_name;
        }
        
        $rootScope.page_title = route.pageTitle;
        $rootScope.page_subtitle = route.subtitle;
        $rootScope.page_about = route.about;
    });
    
    $rootScope.app_name = appConfig.app_name;
}]);