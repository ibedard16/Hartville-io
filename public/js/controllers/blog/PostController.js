/*global app*/
app.controller('PostController', ['$scope', '$routeParams', '$filter', 'Post', '$sce', function($scope, $routeParams, $filter, Post, $sce){
	Post.get({id:$routeParams.id}).$promise.then(function(data) {
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