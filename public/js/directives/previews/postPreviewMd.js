app.directive('postPreviewMd', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/postPreviewMd.html',
		scope: {
            post: '=post',
        },
	};
});