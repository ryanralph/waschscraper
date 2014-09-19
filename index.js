var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

console.log('started');
var timerDuration = 1 * 60 * 1000; //(minutes * 60 * 1000)
var timeCorrectionFactor = -8;
var json = {};
var csv = "";
setInterval(function() {
	url = 'http://lions.kade.stw.uni-erlangen.de/plugins/wash/wash.php';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html, { normalizeWhitespace: true });

			var mode = [];
			var remainingTime = [];

			$('font strong').filter(function(){
		        var data = $(this);
		        mode.push(data.text());
	      })
			$('td font').filter(function(){
			  var data = $(this);
			  var tmp = data.text();
			  tmp = tmp.replace("Durchschnitt:","");
			  remainingTime.push(tmp);
			});

		}
		json = { machine1: {name: mode[0],
	  							  mode: mode[3],
								  timeRemaining: remainingTime[9]
								 },
					machine2: {name: mode[1],
								  mode: mode[4],
								  timeRemaining: remainingTime[10]
								 },
					machine3: {name: mode[2],
								  mode: mode[5],
								  timeRemaining: remainingTime[11]
								 }
		};
		var currentTime = new Date();
		var timestamp = new Date();
		timestamp.setHours(currentTime.getHours() + timeCorrectionFactor); //Time correction, computer time is +10, time I'm interested in is +2 therefore 8 hours correction
		csv = timestamp + "," + mode[3] + "," + mode[4] + "," + mode[5] + '\n';
		fs.appendFile('output.csv', csv, function(err) {
			console.log('written data for ' + timestamp);
		});
	})
}, timerDuration);


app.get('/csv', function(req, res){
	res.send(csv);
});

app.get('/json', function(req, res){
	res.send(json);
});

app.listen('8081');

exports = module.exports = app;
