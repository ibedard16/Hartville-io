/*global app*/

app.controller('SidebarController', ['$scope', '$window',function ($scope, $window) {
  $scope.tabs = [
    { title:'Recent News', content:'Okay' },
    { title:'Popular', content:'Let us try'}
  ];
}]);