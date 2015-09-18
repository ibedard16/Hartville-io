/*global angular*/
/*global app*/

app.controller('NewController', ['$location', '$scope', 'postResource', 'toastr', 'storageAvailable', function($location, $scope, postResource, toastr, storageAvailable) {
	
	//postResource.save({},{password:''});
	
	if (storageAvailable('localStorage')){
		var savePost = function () {localStorage.setItem('postBackup', JSON.stringify($scope.formInfo));};
		
		if(localStorage.getItem('postBackup')) {
			try {
				$scope.formInfo = JSON.parse(localStorage.getItem('postBackup')); 
				toastr.info('Post recovered from Local Storage.', {
					positionClass: "toast-bottom-right",
				});
			}
			catch (e) {
				toastr.error('Post backup was found, but it could not be retrieved.', 'Backup Recovery Error');
			}
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
	
	$scope.bindImage = function(file, dest) {
		var	reader = new FileReader();
		reader.onload = function(e){
			$scope.formInfo[dest] = e.target.result;
			$scope.$apply();
		};
		reader.readAsDataURL(file);
	};
	
	$scope.submitForm = function() {
		$scope.formDisabled = true;
		postResource.save({}, angular.extend({}, $scope.formInfo, $scope.login)).$promise.then(function (data) {
        	console.log(data);
        	switch (data.head) {
        		case 'Post Success':
        			toastr.info('Post was successfully published!', 'Success!');
        			$scope.formInfo = {};
        			localStorage.removeItem('postBackup');
        			$scope.formDisabled = false;
        			$location.path(data.redirect);
        			break;
    			case 'Invalid Login':
    				toastr.error('Invalid Username and Password combination.', 'Invalid Credentials');
    				$scope.formDisabled = false;
    				break;
				default:
					toastr.error('The server couldn\'t save the post. Please contact an administrator for help.', 'Post Save Error');
					$scope.formDisabled = false;
					break;
        	}
        });
    };
    
    $scope.resetPost = function () {
    	$scope.formDisabled = true;
    	$scope.resetConfirm = true;
    };
    
    $scope.reset = function (confirmation) {
    	if (confirmation) {
    		if (storageAvailable('localStorage')) {
    			localStorage.removeItem('postBackup');
	    	}
	    	$scope.formInfo = {};
	        $scope.formDisabled = false;
	        $scope.resetConfirm = false;
    	} else {
    		$scope.formDisabled = false;
    		$scope.resetConfirm = false;
    	}
    };
    
    $scope.submitSpam = function() {
    	for (var i=1; i <= 100; i++) {
    		postResource.save({},{
    			password: $scope.login.password,
    			title: 'Test Post ' + i,
    			content: 'This is the content for test post ' + i + '.'
    		});
    	}
    };
    
   	$scope.imageCount = [''];

	$scope.addImage = function () {
	    $scope.imageCount.push('');
	};
}]);