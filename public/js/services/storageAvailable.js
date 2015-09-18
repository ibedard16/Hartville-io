'use strict';
/*global app*/

app.factory('storageAvailable', ['$window', function ($window) {
    return function (storageType) {
    	try {
    		var storage = $window[storageType],
    			x = '__storage_test__';
    		storage.setItem(x, x);
    		storage.removeItem(x);
    		return true;
    	}
    	catch(e) {
    		return false;
    	}
    };
}]);