app.filter('startFrom', function() {
    return function(data, start) {
        if (!data || !data.length) { return; }
        start = +start; //parse to int
        return data.slice(start);
    }
});