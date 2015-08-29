app.controller('NewController', ['$scope', '$sce', '$sanitize', function($scope, $sce, $sanitize){
	$scope.imageCount = [''];

	$scope.addImage = function () {
	    $scope.imageCount.push('');
	};
}]);