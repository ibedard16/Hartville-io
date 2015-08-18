app.directive('postPreviewLg', function () {
	return {
		restrict: 'E',
		templateUrl: 'views/partials/previews/postPreviewLg.html',
		scope: {
            post: '=post',
        },
	};
});