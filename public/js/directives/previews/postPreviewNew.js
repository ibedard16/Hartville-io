app.directive('postPreviewNew', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/postPreviewNew.html',
		scope: {
            post: '=post',
        },
	};
});