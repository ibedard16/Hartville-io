app.service('newPost', ['$http', function($http) {
    return $http.post('/test')
		.then(function(data){
			return data;
		}, function(error){
			return error;
		});
}]);