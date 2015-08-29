app.directive('eventDetail', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/eventDetail.html',
		scope: {
            event: '=event',
        },
	};
});