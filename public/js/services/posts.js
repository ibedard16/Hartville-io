app.factory('posts', ['$http', function($http) {
    return {
    	get: function() {
    		return $http.get('posts.json')
			.then(function(response){
				return response.data;
			}, function(error){
				return error;
			});
    	},
    };
}]);