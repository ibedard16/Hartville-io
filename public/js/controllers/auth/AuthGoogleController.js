'use strict';
/*global app*/
app.controller('AuthGoogleController', ['$window', '$routeParams', 'toastr', function ($window, $routeParams, toastr) {
    if (!$routeParams.code) {
        toastr.warning('This page is only meant to be used for Google Account verification.');
    } else if ($window.opener && $window.opener.location.origin === $window.location.origin) {
        $window.opener.postMessage($routeParams.code, $window.location.origin);
    }
}]);