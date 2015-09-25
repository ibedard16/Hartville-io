/*global app*/

app.directive('dialogueBox', ['$http', '$templateCache', '$compile', function ($http, $templateCache, $compile) {
	return {
		restrict: 'E',
		link: function (scope, element) {
		    scope.$on('showDialogueBox', function (event, attrs) {
				if (!scope.dialogueBoxActive) {
					var url;
					if (attrs.boxType === 'login') {
						url = 'js/directives/dialogueBox/boxes/login.html';
					} else if (attrs.boxType === 'logout') {
						url = 'js/directives/dialogueBox/boxes/logout.html';
					}
					
					if (url) {
						$http.get(url, {cache: $templateCache}).then(function(tplContent){
							element.empty();
							element.append($compile(tplContent.data)(scope));
							element.contents().append($compile('<div class="glyphicon glyphicon-remove close-box" ng-click="closeBox()"></div>')(scope));
							scope.dialogueBoxActive = true;
						});
					}
				}
			});
			
			scope.$on('hideDialogueBox', function (event) {
				if (scope.dialogueBoxActive) {
					scope.dialogueBoxActive = false;
				}
			});
		}
	};
}]);