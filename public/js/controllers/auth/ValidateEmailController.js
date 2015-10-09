'use strict';
/*global app*/
app.controller('ValidateEmailController', ['$location', '$routeParams', '$http', 'toastr', function ($location, $routeParams, $http, toastr) {
    
    if ($routeParams.token) {
        $http.post('/auth/verifyEmail', {token: $routeParams.token}).then(function (data) {
            toastr.success('You can now log in.', 'Email Verified!');
        }, function (err) {
            toastr.error('Something happened during verification, please contact an administrator.', 'Verification Error');
            console.log(err);
        });
    }
    
    $location.path('/');
}]);