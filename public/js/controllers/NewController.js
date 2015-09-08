app.controller('NewController', ['$scope', '$rootScope', '$sanitize', '$http', 'toastr', 'newPost', function($scope, $rootScope, $sanitize, $http, toastr, newPost){

	$rootScope.$on('deletePost', function () {
    	
    });
	
	if (storageAvailable('localStorage')){
		var savePost = function () {localStorage.setItem('postBackup', JSON.stringify($scope.formInfo));};
		
		
	
		if(localStorage.getItem('postBackup')) {
			$scope.formInfo = JSON.parse(localStorage.getItem('postBackup')); 
			toastr.info('Post recovered from Local Storage.', {
				positionClass: "toast-bottom-right",
			});
		} 
		
		$scope.$watchCollection('formInfo', savePost);
		
	} else {
		toastr.error("If you try to leave the page, your post will not be saved.", "Local Storage Unavailable", {
			"closeButton": true,
			"positionClass": "toast-bottom-right",
			"preventDuplicates": true,
			"timeOut": "0",
			"extendedTimeOut": "0"
		});
	}
	
	$scope.postData = function() {
	    newPost.post($scope.formInfo).then(function(data) {
        	switch (data.data) {
        		case 'Post Success':
        			toastr.info('Post was successfully published!', 'Success!');
        			$scope.formInfo = {};
        			localStorage.removeItem('postBackup');
        			break;
    			case 'Invalid Login':
    				toastr.error('Invalid Username and Password combination.', 'Invalid Credentials')
    				break;
				default:
					toastr.error('The server couldn\'t save the post. Please contact an administrator for help.', 'Post Save Error');
					break;
        	}
        });
    };
    
    $scope.resetPost = function () {
    	$scope.resetConfirm = true;
    };
    
    $scope.reset = function (confirmation) {
    	if (confirmation) {
    		if (storageAvailable('localStorage')) {
    			localStorage.removeItem('postBackup');
	    	}
	    	$scope.formInfo = {};
	        console.log("it should be working!");
	        $scope.resetConfirm = false;
    	} else {
    		$scope.resetConfirm = false;
    	}
    };
    
   	$scope.imageCount = [''];

	$scope.addImage = function () {
	    $scope.imageCount.push('');
	};
}]);