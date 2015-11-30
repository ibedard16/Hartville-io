app.directive('postFooter', ['userProfile', function (userProfile) {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/previews/partials/postFooter.html',
		scope: {
            post: '=post'
        },
        link: function (scope) {
            scope.isCollapsed = true;
			userProfile.watch(function () {
				if (userProfile.loggedIn) {
					if (userProfile.info.perms.indexOf('setPermissions') >= 0) {
						scope.canEdit = true;
					} else if (userProfile.info.perms.indexOf('canPost') >= 0){
						if (userProfile.info.sub === scope.post.authorId) {
							scope.canEdit = true;
						} else {
							scope.canEdit = false;
						}
					} else {
						scope.canEdit = false;
					}
				} else {
					scope.canEdit = false;
				}
			});
        }
	};
}]);