'use strict';
/*global app*/

app.factory('authSendCredentials', ['$location', '$http', '$rootScope', 'authToken', 'toastr', function ($location, $http, $rootScope, authToken, toastr) {
    var submitUser = function (remember, url, email, password, redirect) {
        return $http.post(url, {email:email, password:password})
            .then(
                function (response) {
                    if (url === 'login') {
                        toastr.success('You have successfully logged in!','Success');
                    } else if (url === 'signup') {
                        toastr.success('You have successfully signed up!','Success');
                    } else {
                        toastr.success('I don\'t know what you were trying to do, but you were successful', 'Success');
                    }
                    if (remember) {
                        authToken.setStorageType('localStorage');
                    } else {
                        authToken.setStorageType('sessionStorage');
                    }
                    authToken.setToken(response.data.token);
                    $rootScope.$broadcast('userUpdate');
                    if (redirect) {
                        $location.path(redirect);
                    }
                }, 
                function (error) {
                    error.data = error.data.replace('\n', '');
                    switch(error.data) {
                        case "Invalid Login":
                            toastr.error('Either the Email or the Password is incorrect.', 'Invalid Login');
                            break;
                        case 'Email not Found':
                            toastr.error('The email address you entered was not found in our database. Do you even have an account?', 'Email not Found');
                            break;
                        case 'Email Already in Use':
                            toastr.error('This email is already in use. <br /><br /> There are three scarios where this could happen:<ul><li>You have an account and forgot about it.</li><li>You are trying to impersonate someone else by using their email.</li><li>Someone else is impersonating you using your email.</li></ul> <br/> We hope it\'s the first one. Identity theft is no joke.', 'Email in Use', {
                                allowHtml: true,
                                timeOut: 20000
                            });
                            break;
                        default:
                            toastr.error(error.statusText + ' ' + error.data, 'Unrecognized error');
                    }
                    console.log(error);
            });
    };
    return {
        login: function (remember, email, password, redirect) {
            var url = 'login';
            return submitUser(remember, url, email, password, redirect);
        },
        
        signup: function (remember, email, password, redirect) {
            var url = 'signup';
            return submitUser(remember, url, email, password, redirect);
        },
    };
}]);