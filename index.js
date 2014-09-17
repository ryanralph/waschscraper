var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

console.log('started');
var timerDuration = 1 * 60 * 1000; //(minutes * 60 * 1000)
setInterval(function() {
	url = 'http://lions.kade.stw.uni-erlangen.de/plugins/wash/wash.php';

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html, { normalizeWhitespace: true });

			var mode = [];
			var remainingTime = [];
			var json = {};

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
								  timeRemaining: mode[0]
								 },
					machine2: {name: mode[1],
								  mode: mode[4],
								  timeRemaining: mode[0]
								 },
					machine3: {name: mode[2],
								  mode: mode[5]},
								  timeRemaining: mode[0]
		};
		var currentTime = new Date();
		var timestamp = new Date();
		timestamp.setHours(currentTime.getHours() - 8); //Time correction, computer time is +10, time I'm interested in is +2 therefore 8 hours correction
		var csv = timestamp + "," + mode[3] + "," + mode[4] + "," + mode[5] + '\n';
        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3 :  callback function - a callback function to let us know the status of our function
		  fs.appendFile('output.csv', csv, function(err) {
		  		console.log('written data for ' + timestamp);
		  });
	})
}, timerDuration);

exports = module.exports = app;
