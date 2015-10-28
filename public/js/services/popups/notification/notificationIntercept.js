'use strict';
/*global app*/

app.factory('notificationIntercept', ['notification', function (notification) {
    return {
        request: function (config) {
            return config;
            
        },
        response: function (response) {
            if (response.data.notification) {
                var message = response.data.notification;
                notification[message.type](message.body,message.title);
            }
            return response;
        },
        responseError: function (response) {
            if (response.data.notification) {
                var message = response.data.notification;
                notification[message.type](message.body,message.title);
            }
            return response;
        }
    };
}]);