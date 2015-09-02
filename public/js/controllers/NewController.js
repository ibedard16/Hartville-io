app.controller('NewController', ['$scope', '$sanitize', '$http', 'toastr', function($scope, $sanitize, $http, toastr){

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
	
	$scope.postData = function() {
        $http({
            method : 'POST',
            url : '/test',
            data : $scope.formInfo
        })
    }
	
	$scope.imageCount = [''];

	$scope.addImage = function () {
	    $scope.imageCount.push('');
	};
}]);