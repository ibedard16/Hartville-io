var app = angular.module("Hartville_io", [])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'blogDisplay.html',
                controller: 'BlogController'
            })
            .when('/phones/:phoneId', {
                templateUrl: 'partials/phone-detail.html',
                controller: 'PhoneDetailCtrl'
            })
           
  }]);