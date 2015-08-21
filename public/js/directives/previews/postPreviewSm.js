app.directive('postPreviewSm', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/postPreviewSm.html',
		scope: {
            post: '=post',
        },
	};
});