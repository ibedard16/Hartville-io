/*global app*/
app.factory('userProfile', ['$auth', 'notification', function($auth, notification) {
    var watchers = [];
    function triggerWatchers () {
        for (var i = 0; i < watchers.length; i++) {
            watchers[i]();
        }
    }
    var user = {
        update: function () {
            if ($auth.isAuthenticated()) {
                var payload = $auth.getPayload();
                user.info = payload;
                user.loggedIn = true;
                triggerWatchers();
            } else {
                user.info = {};
                user.loggedIn = false;
                triggerWatchers();
            }
        },
        logout: function () {
            $auth.logout();
            user.update();
            notification.warning('You have been logged out.', 'Logged Out');
        },
        watch: function (watcher) {
            watcher();
            watchers.push(watcher);
        }
    };
    
    user.update();
    
    return user;
}]);