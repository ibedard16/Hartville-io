app.directive('postPreviewSm', function () {
	return {
		restrict: 'E',
		templateUrl: 'views/postPreviewSm.html',
		scope: {
            post: '=post',
        },
	};
});