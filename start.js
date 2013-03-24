var express = require('express');
var usage 	= require('usage');
var util 	= require('util');

var app = express();
app.get('/stress', function(req, res) {

	console.log('starting stress test');
	var open = true;

	res.writeHead(200, {
		'Content-Type': 'text/html; charset=UTF-8'
	});

	var data = [];

	(function startStress() {

		for(var lc=0; lc<99999999; lc++) {
		}

		if(open) {
			process.nextTick(startStress);
		}
	})();

	var usageHandler = setInterval(function() {

		usage.lookup(process.pid, writeUsage);
	}, 1000);

	req.on('close', function() {

		console.log('ending stress test');

		data = [];
		open=false;
		clearTimeout(usageHandler);
	});

	function writeUsage(err, usage) {

		if(err) {
			res.write('err: ' + err.message + "<br>");
		} else {
			var cpu = usage.cpu.toFixed(2);
			var memory = (usage.memory/(1024 * 1024)).toFixed(2);
			res.write(util.format("cpu: %s% mem: %smb<br>\n", cpu, memory));
		}
	}
});

var port = 80;
console.log('starting app on port:', port);
app.listen(port);