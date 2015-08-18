app.directive('postPreviewMd', function () {
	return {
		restrict: 'E',
		templateUrl: 'views/partials/previews/postPreviewMd.html',
		scope: {
            post: '=post',
        },
	};
});