/*global app*/
/*global angular*/
app.factory('userProfile', ['$window', '$auth', 'notification', 'User', function($window, $auth, notification, User) {
    var watchers = [];
    function triggerWatchers () {
        for (var i = 0; i < watchers.length; i++) {
            try {
                watchers[i]();
            } catch (e) {
                watchers.splice(i, 1);
            }
        }
    }
    var user = {
        update: function () {
            if ($auth.isAuthenticated()) {
                var payload = $auth.getPayload();
                User.getBypassCacheForId({id: payload.sub}, function (data) {
                    user.loggedIn = true;
                    user.info = angular.extend({}, data, payload);
                    
                    if ((user.info.exp * 1000) - Date.now() > 305000) {
                        user.timeOut = $window.setTimeout(function() {
                            
                            user.timeOut = $window.setTimeout(function () {
                                
                                user.timeOut = $window.setTimeout(function () {
                                    
                                    user.timeOut = undefined;
                                    notification.warning('Your session expired.');
                                    user.logout();
                                    
                                }, 60000);
                                notification.warning('You have 1 minute left on your session.', '1 Minute Left');
                                
                            }, (user.info.exp * 1000) - Date.now() - 60000);
                            notification.warning('You have 5 minutes left on your session.', '5 Minutes Left');
                            
                        }, (user.info.exp * 1000) - Date.now() - 300000);
                    } else if ((user.info.exp * 1000) - Date.now() > 65000) {
                        user.timeOut = $window.setTimeout(function () {
                            
                            user.timeOut = $window.setTimeout(function () {
                                
                                user.timeOut = undefined;
                                notification.warning('Your session expired.');
                                user.logout();
                                
                            }, 60000);
                            notification.warning('You have 1 minute left on your session.', '1 Minute Left');
                            
                        }, (user.info.exp * 1000) - Date.now() - 60000);
                        notification.warning('You have less than 5 minutes left on your session.', '5 Minutes Left');
                    } else if ((user.info.exp * 1000) - Date.now() > 6000) {
                        user.timeOut = $window.setTimeout(function () {
                            
                            user.timeOut = undefined;
                            notification.warning('Your session expired.');
                            user.logout();
                            
                        }, (user.info.exp * 1000) - Date.now());
                        notification.warning('You have less than 1 minute left on your session.', '1 Minute Left');
                    } else {
                        user.timeOut = undefined;
                        notification.warning('Your session expired.');
                        user.logout();
                    }
                    user.initialized = true;
                    triggerWatchers();
                });
            } else {
                user.info = {};
                user.loggedIn = false;
                triggerWatchers();
            }
        },
        logout: function () {
            if (user.timeOut) {
                $window.clearTimeout(user.timeOut);
            }
            $auth.logout();
            user.update();
            notification.warning('You have been logged out.', 'Logged Out');
        },
        watch: function (watcher) {
            if (user.initialized) {
                watcher();
            }
            watchers.push(watcher);
        }
    };
    
    user.update();
    
    return user;
}]);