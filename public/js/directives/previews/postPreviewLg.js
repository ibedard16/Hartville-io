app.directive('postPreviewLg', function () {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/postPreviewLg.html',
		scope: {
            post: '=post',
        },
        /*link: function () {
			Prism.highlightAll(true);
			console.log('prism run');
        }*/
	};
});