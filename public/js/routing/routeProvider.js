/*global app*/

app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$authProvider', function ($routeProvider,$locationProvider,$httpProvider,$authProvider) {
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
		controller: 'HomeController' 
	})
	.when('/new', {
		pageTitle: 'Hartville.io | New Post',
		templateUrl: 'views/new.html',
		controller: 'NewController'
	})
	/*.when('/blog', {
		redirectTo: '/blog/page/1'
	})*/
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
		controller: 'PostController'
	})
	.when('/blog/author/:author', {
		pageTitle: 'Hartville.io | Author',
		title: 'Blog',
		templateUrl: 'views/user.html',
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
	.when('/events/event/:id', {
		pageTitle: 'Hartville.io | Event',
		title: 'Events',
		templateUrl: 'views/eventDetails.html',
		controller: 'BlogController'
	})
	.when('/signup', {
		pageTitle: 'Hartville.io | Sign Up',
		title: 'Sign Up',
		templateUrl: 'views/signUp.html',
		controller: 'SignupController'
	})
	.when('/login', {
		pageTitle: 'Hartville.io | Log In',
		title: 'Log In',
		templateUrl: 'views/login.html',
		controller: 'LoginController'
	})
	.when('/logout', {
		controller: 'LogoutController',
		template: ''
	})
	.when('/components', {
		templateUrl: 'views/components.html',
		controller: 'BlogController'
	})
	.when('/authgoogle', {
		templateUrl: 'views/404.html',
		controller: 'AuthGoogleController'
	})
	.otherwise({
		title: '404 Error',
		templateUrl: 'views/404.html',
	});
	
	$httpProvider.interceptors.push('authIntercept');
	
	$authProvider.loginUrl = 'login';
	$authProvider.signupUrl = 'signup';
	
	$authProvider.google({
		clientId: '1065972837087-m4vql5k5rv3q7mler25k5cmu892joekb.apps.googleusercontent.com',
		url: 'auth/google',
		redirectUri: window.location.origin + '/authgoogle',
		scope: ['profile','email']
	});
	
	$authProvider.facebook({
		clientId: '438217639703965',
		url: 'auth/facebook',
		redirectUri: window.location.origin + '/authfacebook',
		//scope: ['profile','email']
	});
}]);

//Adjusts page titles to match Route.title

app.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.pageTitle = current.$$route.pageTitle;
        $rootScope.title = current.$$route.title;
    });
}]);