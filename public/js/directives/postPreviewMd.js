app.directive('postPreviewMd', function () {
	return {
		restrict: 'E',
		templateUrl: 'views/postPreviewMd.html',
		scope: {
            post: '=post',
        },
	};
});