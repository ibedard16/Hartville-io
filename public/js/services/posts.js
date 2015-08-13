app.service('posts', ['$http', function($http) {
    return $http.get('posts.json')
		.success(function(data){
			return data;
		})
		.error(function(error){
			return error;
		});
}]);