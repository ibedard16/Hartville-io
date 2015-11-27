/*global app*/

app.controller('EditPostController', ['$location', '$routeParams', '$scope', 'Post', 'notification', 'storageAvailable', 'dBox', function($location, $routeParams, $scope, Post, notification, storageAvailable, dBox) {
	
	$scope.mode = 'edit';
	
	if (storageAvailable('localStorage')){
		var savePost = function () {localStorage.setItem('postEditbackup' + $routeParams.id, JSON.stringify($scope.formInfo));};
		
		if(localStorage.getItem('postEditbackup' + $routeParams.id)) {
			try {
				$scope.formInfo = JSON.parse(localStorage.getItem('postEditbackup' + $routeParams.id));
				if ($scope.formInfo && angular.equals($scope.formInfo, {})) {
					notification.info('Post recovered from Local Storage.', 'Post Backup Recovered');
				}
			} catch (e) {
				notification.error('Post backup was found, but it could not be retrieved.', 'Post Backup Error');
			}
		} 
		
		$scope.$watchCollection('formInfo', savePost);
		
	} else {
		notification.error("If you try to leave the page, your post will not be saved.", "Local Storage Unavailable");
	}
	
	$scope.bindImage = function(file, dest) {
		var	reader = new FileReader();
		reader.onload = function(e){
			$scope.formInfo[dest] = e.target.result;
			$scope.$apply();
		};
		reader.readAsDataURL(file);
		savePost();
	};
	
	$scope.unbindImage = function(dest) {
	    $scope.formInfo[dest] = null;
	    savePost();
	};
	console.log($scope);
	if (!$scope.formInfo || angular.equals($scope.formInfo, {})) {
    	Post.get({id:$routeParams.id}).$promise.then(function(data) {
    		console.log(data);
    		if (data.notification) {
    			location.path('/');
    		} else {
    			$scope.formInfo = data;
    			if (!$scope.formInfo.categories) {
            		$scope.formInfo.categories = [];
            	}
    		}
    	});
	}
	
	$scope.bindTag = function (tag) {
		if ($scope.formInfo.categories.indexOf(tag) === -1) {
			$scope.formInfo.categories.push(tag);
		} else {
			$scope.formInfo.categories.splice($scope.formInfo.categories.indexOf(tag), 1);
		}
		savePost();
	};
	
	$scope.submitForm = function() {
		$scope.formDisabled = true;
		Post.save({updatePost: $routeParams.id}, $scope.formInfo, function (response) {
			if (response.success) {
				notification.success('Post was successfully updated!');
				$scope.formInfo = {};
				localStorage.removeItem('postEditbackup' + $routeParams.id);
				$scope.formDisabled = false;
				$location.path(response.redirect);
			} else {
				$scope.formDisabled = false;
			}
		});
    };
    
    $scope.resetPost = function () {
    	dBox.getConfirmation('This will discard the changes to the post you are currently working on. Do you really want to do this?', function () {
    		if (storageAvailable('localStorage')) {
    			localStorage.removeItem('postEditbackup' + $routeParams.id);
	    	}
	    	$scope.formInfo = {};
	    	$location.path('/');
    	});
    };
    
    $scope.deletePost = function () {
    	dBox.getConfirmation('This will completely delete the post you are editing, no one will ever be able to read it again. Do you really want to do this?', function () {
    		Post.save({deletePost: $routeParams.id}, {}, function (response) {
				if (response.success) {
					notification.warning('Post was deleted!');
					$scope.formInfo = {};
					localStorage.removeItem('postEditbackup' + $routeParams.id);
					$scope.formDisabled = false;
					$location.path('/');
				} else {
					$scope.formDisabled = false;
				}
			});
    	});
    };
}]);