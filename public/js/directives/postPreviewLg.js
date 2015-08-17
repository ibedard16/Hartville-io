app.directive('postPreviewLg', function () {
	return {
		restrict: 'E',
		templateUrl: 'views/postPreviewLg.html',
		scope: {
            post: '=post',
        },
	};
});