"use strict";

const port = 3000;
const BACKEND_URL = "http://127.0.0.1:5000/";
const GET_API = "tasks";


const http = require("http");
const express = require('express');
const app = express();

app.get('/listTasks', function(req, res) {
	console.log("trying to fetch tasks from API");
	let fetchTasks = http.get(BACKEND_URL+GET_API, function (response) {
		var buffer = "";
        var tasks = "";
        response.on("testEvent", testEventFunc);

	    response.on("data", function (chunk) {
	        buffer += chunk;
	    }); 

	    response.on("end", function (err) {
	        tasks = JSON.parse(buffer);
	        console.log("tasks", tasks);
	        response.emit("testEvent");
   		});

   		function testEventFunc () {
   			console.log("event fired");
   		}
   		// console.log("tasks", tasks);
   		// response.send(tasks);
	});
	res.send("res.send");
	res.end();
	// console.log(fetchTasks);
});

app.listen(port, () => console.log("Server ready"));