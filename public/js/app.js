/*global angular*/
var app = angular.module('Hartville-io', ['ui.bootstrap', 'ngRoute', 'mgcrea.ngStrap', 'ngAnimate', 'ngSanitize', 'truncate', 'textAngular', 'ngResource', 'satellizer']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$authProvider', 'appConfig', '$provide', '$resourceProvider', function ($routeProvider,$locationProvider,$httpProvider,$authProvider,appConfig, $provide, $resourceProvider) {
	
	$resourceProvider.defaults.stripTrailingSlashes = false;
	
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
	.when('/blog/newPost', {
		pageTitle: 'New Post',
		templateUrl: 'views/new.html',
		controller: 'NewPostController'
	})
	.when('/blog/author/:author', {
		pageTitle: 'Blog',
		templateUrl: 'views/user.html',
		controller: 'AuthorController'
	})
	.when('/about', {
		pageTitle: 'About',
		templateUrl: 'views/about.html',
		controller: 'BlogController'
	})
	.when('/spotlight', {
		pageTitle: 'Spotlight',
		templateUrl: 'views/spotlight.html',
		controller: 'SpotlightController'
	})
	.when('/community', {
		pageTitle: 'Community',
		templateUrl: 'views/community.html',
		controller: 'BlogController'
	})
	.when('/profile', {
		pageTitle: 'Your Profile',
		controller: 'ProfileController',
		templateUrl: 'views/profile.html'
	})
	.when('/events', {
		pageTitle: 'Events',
		templateUrl: 'views/events.html',
		controller: 'EventsController'
	})
	.when('/events/:id', {
		pageTitle: 'Events',
		templateUrl: 'views/eventDetails.html',
		controller: 'EventDetailController'
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
	
	$httpProvider.interceptors.push('externalAuthIntercept');
	$httpProvider.interceptors.push('notificationIntercept');
	
	$authProvider.loginUrl = 'auth/login';
	$authProvider.signupUrl = 'auth/signup';
	
	var OAuth_providers = appConfig.OAuth_providers;
	
	for (var providerName in OAuth_providers) {
		
		var provider = OAuth_providers[providerName];
		
		provider.redirectUri = window.location.origin + '/auth' + providerName;
		
		provider.url = 'OAuth/' + OAuth_providers[providerName].url;
		console.log(provider.url);
		
		$authProvider[providerName](provider);
		
		provider.url = 'OAuth/binder/' + OAuth_providers[providerName].url.slice(6);
		console.log(provider.url);
		provider.name = providerName + 'binder';
		
		$authProvider.oauth2(provider);
	}
	
	$provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
        taRegisterTool('code', {
            iconclass: "fa fa-code",
            action: function() {
            	var editor = this.$editor();
            	editor.wrapSelection("formatBlock", "<code>");
            },
            activeState: function(){ return !!this.$editor().queryFormatBlockState('code'); }
        });
        taOptions.toolbar[1].push('code');
        return taOptions;
    }]);
	
}]);

app.run(['$rootScope', 'appConfig', 'updatePageTitle', function($rootScope, appConfig, updatePageTitle) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        var route = current.$$route;
        updatePageTitle(route.pageTitle);
        $rootScope.page_subtitle = route.subtitle;
    });
    
    $rootScope.app_name = appConfig.app_name;
    $rootScope.app_description = appConfig.app_description;
}]);