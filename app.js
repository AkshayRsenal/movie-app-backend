// const https = require('https');
const hostname = '127.0.0.3';
const port = 3000;


var request = require('request');
request('http://www.omdbapi.com/?apikey=9030182c&s=space&y=2001', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
})


