/*global app*/

app.controller('NewPostController', ['$location', '$scope', 'Post', 'notification', 'storageAvailable', 'dBox', function($location, $scope, Post, notification, storageAvailable, dBox) {
	
	if (storageAvailable('localStorage')){
		var savePost = function () {localStorage.setItem('postBackup', JSON.stringify($scope.formInfo));};
		
		if(localStorage.getItem('postBackup')) {
			try {
				$scope.formInfo = JSON.parse(localStorage.getItem('postBackup')); 
				notification.info('Post recovered from Local Storage.', 'Post Backup Recovered');
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
	
	if (!$scope.formInfo.categories) {
		$scope.formInfo.categories = [];
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
		Post.save({}, $scope.formInfo, function (response) {
			if (response.success) {
				notification.success('Post was successfully published!');
				$scope.formInfo = {};
				localStorage.removeItem('postBackup');
				$scope.formDisabled = false;
				$location.path(response.redirect);
			} else {
				$scope.formDisabled = false;
			}
		});
    };
    
    $scope.resetPost = function () {
    	dBox.getConfirmation('This will completely delete the post you are working on. You will never be able to recover it. Do you really want to do this?', function () {
    		if (storageAvailable('localStorage')) {
    			localStorage.removeItem('postBackup');
	    	}
	    	$scope.formInfo = {};
    	});
    };
}]);