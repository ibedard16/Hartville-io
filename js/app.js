(function(){
	var app = angular.module('blog', ['ui.bootstrap', 'ngRoute']);

	app.config(function ($routeProvider) {
	    $routeProvider
            .when('/', {
                templateUrl: 'views/index.html',
            })
            .when('/postExample/', {
                templateUrl: 'views/postExample.html', 
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

	app.directive('websiteNavigation', function () {
		return {
			restrict: 'E',
			templateUrl: 'views/website-navigation.html'
		};
	});
    
	app.controller('BlogController', function(){
		this.post = info;
	});

	app.controller('PanelController', function(){
		this.tab = 1;

		this.selectTab = function(setTab) {
			this.tab = setTab;
		};
		this.isSelected = function(checkTab) {
			return this.tab === checkTab;
		};
	});

	app.controller("DropdownController", function ($scope) {
	    $scope.isCollapsed = true;
	  });

	var info = [

		{
			title: 'Etiam Dapibus',
			link: 'postExample.html',
			author: 'John Smith',
			date: 1388123412323,
			content: 'Sed congue quam sed est porta, at tempor feugiat. Etiam dapibus congue imperdiet. Nam commodo nisi et diam gravida elementum Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas malesuada fringilla ex, id placerat diam consectetur quis. Lorem et magna consectetur vitae. Maecenas eu venenatis mauris, congue congue nulla.',
			tags: ['congue','NULLA','aliquam vitae'],
			images: [
				{
					full: 'images/post-01-full.jpg',
					thumb: ''
				}
			]
		},
		{
			title: 'In Augue Orci',
			link: 'postExample.html',
			author: 'Tom Sulivan',
			date: 1994123512323,
			content: 'Aliquam lacinia, ex at lobortis varius, velit nulla tempor neque, vitae rutrum leo eros sodales ligula. In augue orci, varius non nunc sed, consequat imperdiet massa. Duis vitae blandit felis, sed luctus massa. Etiam dignissim nunc urna, a egestas enim cursus quis. Nam nec pretium sapien. Phasellus quis consectetur sem.',
			tags: ['lobortis','velit','nam', 'cursus'],
			images: [
				{
					full: 'images/post-02-full.jpg',
					thumb: ''
				}
			]
		},
		{
			title: 'Nullam et Nisi',
			link: 'postExample.html',
			author: 'Tom Sulivan',
			date: 1336123312323,
			content: 'Morbi molestie diam id urna fringilla commodo eget vel justo. In bibendum viverra risus, a tempus elit auctor tincidunt. Quisque id malesuada nunc, ut eleifend metus. Quisque eget vehicula nunc. Fusce faucibus sit amet libero accumsan viverra. Vestibulum facilisis enim eget nisi ullamcorper iaculis. Nullam et nisi turpis. Proin pretium risus a magna elementum ultrices.',
			tags: ['nunc', 'enim et nisi'],
			images: [
				{
					full: 'images/post-03-full.jpg',
					thumb: ''
				}
			]
		},
		{
			title: 'Curabitur Eget Semper',
			link: 'postExample.html',
			author: 'Joanne Smith',
			date: 1336123517323,
			content: 'Curabitur eget semper nibh. Ut sed blandit velit, sit amet pellentesque libero. Vivamus varius dolor sed quam accumsan porta. Nunc feugiat orci nec semper lobortis. Nullam eget accumsan est. Nam placerat eleifend suscipit. Aenean tincidunt ultrices nulla ut volutpat. Pellentesque sem magna, molestie ut massa ut, convallis dictum leo. In bibendum viverra risus, a tempus elit auctor tincidunt. Quisque id malesuada nunc, ut eleifend metus.',
			tags: ['pellentesque', 'molestie', 'tincidunt'],
			images: [
				{
					full: '',
					thumb: ''
				}
			]
		}
	];

	

})();