app.factory('posts', ['$http', function($http) {
    return {
    	get: function(params) {
    		console.log(params);
    		return $http.get('posts.json', {params:params})
			.then(function(response){
				return response.data;
			}, function(error){
				return error;
			});
    	},
    };
}]);