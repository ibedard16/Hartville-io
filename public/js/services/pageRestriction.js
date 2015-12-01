'use strict';
/*global app*/

app.factory('pageRestriction', ['$location', 'userProfile', 'notification', function ($location, userProfile, notification) {
    return function (permission) {
        var page = $location.path();
        userProfile.watch(function() {
            if (page === $location.path()) {
                if (!userProfile.loggedIn) {
                    notification.warning('You must be logged in to view that page.');
                    return $location.path('/');
                }
                
                if (!permission) {
                    return;
                }
                
    			if (!(userProfile.info.perms.indexOf(permission) >= 0)) {
    			    notification.warning('You do not have the authority to view that page.');
                    return $location.path('/');
    			}
            } else {
                throw new Error('User is not on the same page when script was initialized.');
            }
        });
    };
}]);