'use strict';
/*global app*/
/*global toastr*/

app.factory('notification', function () {
    return {
        success: function (body, title, options) {
            toastr.success(body, title, options);
        },
        error: function (body, title, options) {
            toastr.error(body, title, options);
        },
        warning: function (body, title, options) {
            toastr.warning(body, title, options);
        },
        info: function (body, title, options) {
            toastr.info(body, title, options);
        },
    };
});