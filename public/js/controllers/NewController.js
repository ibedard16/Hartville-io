app.controller('NewController', ['$scope', '$sce', function($scope, $sce){
	$scope.snippet = '<textarea type="text" name="content" class="form-control" rows="5"></textarea>';
	
	$scope.content = function() {
	    return $sce.trustAsHtml('<textarea type="text" name="content" class="form-control" rows="5" ng-model="formInfo.content"></textarea>');
	};
	
	$scope.contentLength = [];
	
	$scope.moreContent = function () {
	    $scope.contentLength.push('');
	};
}]);