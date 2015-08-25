app.directive('eventPreviewLg', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/eventPreviewSm.html',
		scope: {
            event: '=event',
        },
	};
});