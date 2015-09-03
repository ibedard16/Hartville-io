app.controller('NewController', ['$scope', '$sanitize', '$http', 'toastr', 'newPost', function($scope, $sanitize, $http, toastr, newPost){

	if (storageAvailable('localStorage')){
		var savePost = function () {localStorage.setItem('postBackup', JSON.stringify($scope.formInfo));};
		
		//$scope.$watchCollection('formInfo', savePost);
	
		if(localStorage.getItem('postBackup')) {
			$scope.formInfo = JSON.parse(localStorage.getItem('postBackup')); 
			toastr.info('Post recovered from Local Storage.', {
				positionClass: "toast-bottom-right",
			});
		}
		
	} else {
		toastr.error("If you try to leave the page, your post will not be saved.", "Local Storage Unavailable", {
			"closeButton": true,
			"positionClass": "toast-bottom-right",
			"preventDuplicates": true,
			"timeOut": "0",
			"extendedTimeOut": "0"
		});
	}
	
	$scope.postData = function(blogPost) {
	    newPost.post(blogPost).then(function(data) {
        	switch (data.data) {
        		case 'Post Success':
        			toastr.info('Post was saved successfully!', 'Success!');
        			$scope.formInfo = {};
        			localStorage.removeItem('postBackup');
        			break;
    			case 'Invalid Login':
    				toastr.error('Invalid Username and Password combination.', 'Invalid Credentials')
    				break;
				default:
					toastr.error('The server couldn\'t save the post. Please contact an administrator for help.', 'Post Save Error');
        	}
        });
    };
	
	$scope.imageCount = [''];

	$scope.addImage = function () {
	    $scope.imageCount.push('');
	};
}]);