const http = require('http');
const { Client } = require('@elastic/elasticsearch')
const config = require('config');
const request = require('request');
const elasticConfig = config.get('elastic');

const client = new Client({
  cloud: {
    id: elasticConfig.cloudID
  },
  auth: {
    username: elasticConfig.username,
    password: elasticConfig.password
  }
})

async function run(movieDetails) {
    await client.index({
        index: 'movie_database',
        id: movieDetails.imdbID,
        body: {
        title: movieDetails.Title,
        director: movieDetails.Director,
        plot: movieDetails.Plot,
        poster: movieDetails.Poster
        }
    })
}

    

function fetchMovieData(){
    request('http://www.omdbapi.com/?apikey=9030182c&s=space&y=2001', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let movieData = JSON.parse(body);
            movieData.Search.forEach(function(element, index){
                request( 'http://www.omdbapi.com/?apikey=9030182c&i='+element.imdbID, function(error,response, body){
                    if(!error && response.statusCode == 200){
                        run(JSON.parse(body));
                    }
                })
            });
            

            

        } 
    })
}


http.createServer(function (req, res) {
var url = req.url;
 if(url ==='/movies'){
    fetchMovieData(res);
    res.writeHead(200,{'Content-Type': 'application/json'});
            res.write( JSON.stringify({
               countUpdated : true
            }));
 }    
}).listen(3000, function(){
    console.log("server start at port 3000"); //the server object listens on port 3000
   });