app.controller('PagerController', ['$scope', 'Post', function ($scope, Post) {
  $scope.posts = [];
  $scope.pageSize = 5;
  $scope.currentPage = 0;
}]); 