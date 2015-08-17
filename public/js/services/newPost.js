app.service('newPost', ['$http', function($http) {
    return $http.post('/create')
		.then(function(data){
			return data;
		}, function(error){
			return error;
		});
}]);