/*global app*/
app.controller('PostController', ['$scope', '$routeParams', '$filter', 'postResource', '$sce', function($scope, $routeParams, $filter, postResource, $sce){
	postResource.get({id:$routeParams.id}).$promise.then(function(data) {
		if (data.status == 404) {
			$scope.error = true;
		} else {
			$scope.post = data;
		}
	});
	
	$scope.deliberateTrust = function (html) {
		return $sce.trustAsHtml(html);
	};
}]);