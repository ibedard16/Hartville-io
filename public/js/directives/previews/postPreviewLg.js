app.directive('postPreviewLg', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/postPreviewLg.html',
		scope: {
            post: '=post',
        },
	};
});