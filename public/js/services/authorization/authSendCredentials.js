'use strict';
/*global app*/

app.factory('authSendCredentials', ['$location', '$http', '$rootScope', 'authToken', 'toastr', '$window', 'clientId', function ($location, $http, $rootScope, authToken, toastr, $window, clientId) {
    var submitUser = function (remember, url, params, redirect) {
        return $http.post(url, params)
            .then(
                function (response) {
                    if (url === 'login') {
                        toastr.success('You have successfully logged in!','Success');
                    } else if (url === 'signup') {
                        toastr.success('You have successfully signed up!','Success');
                    } else if (url === 'auth/google') {
                        toastr.success('You are now logged in using google!','Success');
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
                    $rootScope.$broadcast('hideDialogueBox');
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
    
    var urlBuilder = [];
    
    urlBuilder.push('response_type=code',
                    'client_id=' + clientId.google,
                    'redirect_uri=' + $window.location.origin + '/authgoogle',
                    'scope=profile email');
    
    return {
        login: function (remember, email, password, redirect) {
            var url = 'login',
                params = {
                    email:email,
                    password: password
                }
            return submitUser(remember, url, params, redirect);
        },
        
        signup: function (remember, email, password, redirect) {
            var url = 'signup';
                params = {
                    email:email,
                    password: password
                }
            return submitUser(remember, url, params, redirect);
        },
        
        googleAuth: function (remember, redirect) {
            
            var url = 'https://accounts.google.com/o/oauth2/auth?' + urlBuilder.join('&');
            var options = "width=500, height=500, left=" + (( $window.outerWidth - 500) / 2 ) + ", top=" + (($window.outwerHeight - 500) / 2);
            
            var popup = $window.open(url, '', options);
            
            console.log(popup);
            
            $window.focus();
            
            $window.addEventListener('message', function (event) {
                if (event.origin === $window.location.origin) {
                    var code = event.data;
                    popup.close();
                    
                    var params = {
                        code: code,
                        clientId: clientId.google,
                        redirectUri: $window.location.origin + '/authgoogle'
                    },
                        url = 'auth/google';
                    
                    return submitUser(remember, url, params, redirect);
                }
            });
        }
    };
}]);