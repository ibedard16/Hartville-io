app.factory('events', ['$http', function($http) {
    return {
    	get: function() {
    		return $http.get('events.json')
			.then(function(response){
				return response.data;
			}, function(error){
				return error;
			});
    	},
    };
}]);