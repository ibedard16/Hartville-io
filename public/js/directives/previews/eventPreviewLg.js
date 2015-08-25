app.directive('eventPreviewLg', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/eventPreviewLg.html',
		scope: {
            event: '=event',
        },
	};
});