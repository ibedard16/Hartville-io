'use strict';

var fs = require('fs');
var http = require('http');
var url = require('url');

var server = http.createServer(function(request, response) {
	fs.createReadStream(url.parse(request.url).pathname.substring(1))
		.on('error', function(err) {
			response.writeHead(500);
			response.end('Error encountered (probably the file doesn\'t exist.)');
		})
		.pipe(response)
});

server.listen(1337, 'localhost', function() {
	return console.log('Server listening @ http://localhost:1337 .');
});