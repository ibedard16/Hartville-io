app.factory('updatePageTitle', ['$rootScope', 'appConfig', function ($rootScope, appConfig) {
    return function (new_title) {
        
        if (appConfig.app_name === new_title || new_title === undefined) {
        	$rootScope.pageTitle = appConfig.app_name;
        } else {
            $rootScope.pageTitle = new_title + ' | ' + appConfig.app_name;
        }
        
        $rootScope.page_title = new_title;
    };
}]);