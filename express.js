"use strict";
var fs = require('fs'),
    express = require('express'),
    path = require('path'),
    http = require('http');

var app = express();
app.set('port', process.env.PORT || 8000);
app.use(express.static(path.join(__dirname, 'public')));


function anyHandler(request, response) {
	response.sendFile(__dirname + request.params[0]);
};

app.get("*", anyHandler);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});