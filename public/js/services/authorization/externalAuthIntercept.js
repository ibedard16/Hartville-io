'use strict';
/*global app*/

app.factory('externalAuthIntercept', function () {
    return {
        request: function (config) {
            try {
                if (config.url.substring(0,4) === 'http') {
                    config.headers.Authorization = '';
                }
                
                return config;
            } catch(e) {
                return config;
            }
            
        },
        response: function (response) {
            return response;
        }
    };
});