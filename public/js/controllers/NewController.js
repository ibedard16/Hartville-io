app.controller('NewController', ['$scope', '$sce', '$sanitize', function($scope, $sce, $sanitize){
	$scope.snippet = 
	    'I am an <code>HTML</code>string with ' +
        '<a href="#">links!</a> and other <em>stuff</em>'; //'<textarea name="content" class="form-control" rows="5">
	
	$scope.trustHtml = function(content) {return $sce.trustAsHtml( '<textarea name="content" class="form-control" rows="5"></textarea>');};
	
	$scope.contentLength = [];
	
	$scope.date = Date.now();
	
	$scope.moreContent = function (input) {
	    $scope.contentLength.push(input);
	};
}]);