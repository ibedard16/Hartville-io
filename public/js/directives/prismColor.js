app.directive('prismColor', function () {
	return {
		restrict: 'A',
        link: function (scope, element, attrs, ngModelCtrl) {
			element.ready(function () {
			    Prism.highlightAll();  
			});
        }
	};
});