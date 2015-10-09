'use strict';
/*global app*/

app.factory('authors', ['$http', function($http) {
    return {
    	get: function() {
    		return $http.get('/resources/authors.json')
			.then(function(response){
				return response.data;
			}, function(error){
				return error;
			});
    	},
    };
}]);