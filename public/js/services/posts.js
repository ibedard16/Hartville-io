app.service('posts', ['$http', function($http) {
    return $http.get('posts.json')
		.then(function(response){
			return response.data;
		}, function(error){
			return error;
		});
}]);