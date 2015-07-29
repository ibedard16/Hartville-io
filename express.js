"use strict";

var fs = require('fs');
var express = require('express');
//var url = require('url');
var app = express();

app.set("view engine", "ejs");

function anyHandler(request, response) {
	//var myUrl = url.parse(request.url).pathname;
	var myUrl = request.params[0];
    console.log(myUrl);
    console.log(__dirname + myUrl);
	if(myUrl === "/") {
		response.redirect("views/index.html");
		return;
	};
	
	//fs.createReadStream(myUrl)
	response.sendFile(__dirname + myUrl)
		/*.on('error', function(err) {
			response.writeHead(500);
			response.end('Error encountered (the file probably doesn\'t exist.) File accessed: ' + myUrl);
		})*/
	//.pipe(response);
};

app.get("*", anyHandler);

function listener(){
	console.log('app is listening on http://localhost:8000');
};

app.listen(8000, listener);