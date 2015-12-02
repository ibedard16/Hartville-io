'use strict';
/*global app*/

app.factory('dBox', ['$rootScope', 'notification', function ($rootScope, notification) {
	var box;
	
	return {
		openBox: function (type) {
			if ($rootScope.dialogueBoxActive) {
				return;
			}
			switch (type) {
				case 'login':
					box.open('js/services/popups/dialogueBox/boxes/login.html');
					$rootScope.dialogueBoxActive = true;
					break;
				default:
					console.log('An unrecognized dialogue box was opened.');
					notification.error('Please contact an admin. A program tried to open an unrecognized dialogue box.');
			}
		},
		
		getConfirmation: function (question, callback) {
			if ($rootScope.dialogueBoxActive || typeof question !== 'string' || typeof callback !== 'function') {
				return;
			}
			
			$rootScope.dialogueBoxActive = true;
			box.getConfirmation(question, callback);
		},
		
		close: function () {
			$rootScope.dialogueBoxActive = false;
			box.emptyBox();
		},
		
		registerBox: function (boxToRegister) {
			if (!box) {
				box = boxToRegister;
			}
		}
	};
}]);