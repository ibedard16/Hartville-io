app.service('authors', ['$http', function($http) {
    return $http.get('authors.json')
		.then(function(response){
			return response.data;
		}, function(error){
			return error;
		});
}]);