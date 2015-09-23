/*global app*/

app.directive('dialogueBox', ['$http', '$templateCache', '$compile', function ($http, $templateCache, $compile) {
	return {
		restrict: 'E',
		link: function (scope, element) {
		    scope.$on('showDialogueBox', function (event, attrs) {
				if (!scope.dialogueBoxActive) {
					if (attrs.boxType === 'login') {
						$http.get('views/login.html', {cache: $templateCache}).then(function(tplContent){
							console.log(tplContent.data);
							element.append($compile(tplContent.data)(scope));
							scope.dialogueBoxActive = true;
						});
					}
				}
			});
			
			scope.$on('hideDialogueBox', function (event) {
				if (scope.dialogueBoxActive) {
					element.empty();
					scope.dialogueBoxActive = false;
				}
			});
		}
	};
}]);