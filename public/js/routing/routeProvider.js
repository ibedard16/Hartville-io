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
	.when('/components', {
		templateUrl: 'views/components.html',
		controller: 'BlogController'
	})
	.when('/validateemail', {
		controller: 'ValidateEmailController',
		templateUrl: 'views/404.html'
	})
	.otherwise({
		title: '404 Error',
		templateUrl: 'views/404.html',
		pageTitle: 'Hartville.io | 404 Error'
	});
	
	$httpProvider.interceptors.push('authIntercept');
	
	$authProvider.loginUrl = 'auth/login';
	$authProvider.signupUrl = 'auth/signup';
	
	$authProvider.google({
		clientId: '1065972837087-m4vql5k5rv3q7mler25k5cmu892joekb.apps.googleusercontent.com',
		url: 'OAuth/google',
		redirectUri: window.location.origin + '/authgoogle'
	});
	
	$authProvider.facebook({
		authorizationEndpoint: 'https://www.facebook.com/v2.4/dialog/oauth',
		clientId: '438217639703965',
		url: 'OAuth/facebook',
		redirectUri: window.location.origin + '/authfacebook',
		scope: ['email', 'public_profile']
	});
	
	$authProvider.github({
		authorizationEndpoint: 'https://github.com/login/oauth/authorize',
		clientId: 'bdffc5e7699592a8fd61',
		url: 'OAuth/github',
		redirectUri: window.location.origin + '/authgithub',
	});
}]);

//Adjusts page titles to match Route.title

app.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.pageTitle = current.$$route.pageTitle;
        $rootScope.title = current.$$route.title;
    });
}]);