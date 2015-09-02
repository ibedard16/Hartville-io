app.controller('PostController', ['$scope', '$routeParams', '$filter', 'posts', '$sce', function($scope, $routeParams, $filter, posts, $sce){
	posts.get({post:$routeParams.id}).then(function(data) {
		if (data.status == 404) {
			$scope.error = true;
		} else {
			$scope.post = data.post;
		}
	});
	
	$scope.deliberateTrust = function (html) {
		return $sce.trustAsHtml(html);
	};
}]);