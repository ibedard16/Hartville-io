app.directive('postPreviewSm', function () {
	return {
		restrict: 'E',
		templateUrl: 'views/partials/previews/postPreviewSm.html',
		scope: {
            post: '=post',
        },
	};
});