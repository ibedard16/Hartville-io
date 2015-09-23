'use strict';
/*global app*/

app.factory('authIntercept', ['authToken', function (authToken) {
    return {
        request: function (config) {
            var token = authToken.getToken();
            
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            
            return config;
        },
        response: function (response) {
            return response;
        }
    };
}]);