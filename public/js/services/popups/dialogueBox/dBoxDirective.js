/*global app*/

app.directive('dialogueBox', ['$http', '$templateCache', '$compile', 'dBox', function ($http, $templateCache, $compile, dBox) {
	return {
		restrict: 'E',
		link: function (scope, element) {
			scope.closeBox = function () {
				dBox.close();
			};
			var box = {
				openBox: function (url) {
					$http.get(url, {cache: $templateCache}).then(function(tplContent){
						element.empty();
						element.append($compile(tplContent.data)(scope));
						element.contents().append($compile('<div class="glyphicon glyphicon-remove" ng-click="closeBox()" style="top: 5px; right: 5px; position: absolute;width: initial;height: initial;padding: 0;box-shadow: none;"></div>')(scope));
					});
				},
				
				getConfirmation: function (question, callback) {
					scope.question = question;
					scope.callback = function () {
						dBox.close();
						callback();
					};
					box.openBox('js/services/popups/dialogueBox/boxes/confirm.html');
				},
				
				emptyBox: function () {
					element.empty();
				}
			};
			
			dBox.registerBox(box);
		}
	};
}]);