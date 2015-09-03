/*global angular*/
/*global app*/
app.factory('newPost', ['$http', 'toastr', function($http, toastr) {
    return {
    	post: function(blogPost) {

	    	return $http.post('create', blogPost, {
	    		headers: {
		    		transformRequest: angular.identity,
            		headers: {'Content-Type': undefined}
	    		}
	    	})
			.then(function(data){
				return data;
			}, function(error){
				return error;
			});
    	}
    }
}]);