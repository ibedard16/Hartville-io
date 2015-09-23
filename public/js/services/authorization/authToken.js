'use strict';
/*global app*/

app.factory('authToken', ['$window', 'storageAvailable', function ($window, storageAvailable) {
    if (storageAvailable('sessionStorage')) {
        var cachedToken;
        var storageType = 'sessionStorage';
        var authToken = {
            setToken: function (token) {
                cachedToken = token;
                $window[storageType].setItem('userToken', token);
            },
            getToken: function () {
                if (!cachedToken) {
                    cachedToken = $window[storageType].getItem('userToken');
                }
                
                return cachedToken;
            },
            isAuthenticated: function () {
                return !!authToken.getToken();
            },
            removeToken: function () {
                cachedToken = null;
                $window[storageType].removeItem('userToken');
            },
            setStorageType: function (type) {
                if (!authToken.getToken()) {
                    if (storageAvailable(type)) {
                        storageType = type;
                        console.log(storageType);
                    }
                }
            }
        };
        
        return authToken;
    }
}]);