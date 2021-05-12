const { Client } = require('@elastic/elasticsearch')
const config = require('config');
const request = require('request');
const elasticConfig = config.get('elastic');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const client = new Client({
    cloud: {
        id: elasticConfig.cloudID
    },
    auth: {
        username: elasticConfig.username,
        password: elasticConfig.password
    }
})

app.get('/', (req, res) => {
    res.send('app up and running ')
})

app.get('/refresh', (req, res) => {
    fetchMovieData()
    res.send('refresh completed')
})

function fetchMovieData() {
    request('http://www.omdbapi.com/?apikey=9030182c&s=space&y=2001', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let movieData = JSON.parse(body);
            movieData.Search.forEach(function (element, index) {
                request('http://www.omdbapi.com/?apikey=9030182c&i=' + element.imdbID, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        run(JSON.parse(body));
                    }
                })
            });
        }
    })
}

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


app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})

