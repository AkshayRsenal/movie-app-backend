const request = require('request');
let chai = require('chai');
let chaiHttp = require('chai-http');
let mainjs = require('../app.js')
let expect = require('chai').expect;
let arrayJsonObjElements = ["Title","Year","imdbID","Poster"];
let imdbIDSpecificElements = ["Title","Director","Plot","Poster"]

chai.use(chaiHttp);

describe("Initializing Tests", ()=>{
    console.log( "This part executes once before all tests" );
})

describe("[Test movie-app-backend] /refresh [Routing]", function(){
    it('Check if data is refreshed on Elasticsearch', (done)=>{
        chai.request(mainjs)
        .get('/refresh')
        .end((err,res)=> {
            expect(JSON.stringify(res.text)).equal('"refresh completed"')
            done();
        })
    });

    it('Valid JSON Elements Response in OMDB-API Request without imdbID', (done)=>{
        request('http://www.omdbapi.com/?apikey=9030182c&s=space&y=2001', function (error, response, body) {
            let movieData = JSON.parse(body);
            // console.log(movieData.Search[0])
            if(arrayJsonObjElements.every(property=>{ return movieData.Search[0].hasOwnProperty(property) }) ){
                done();
            }
        })
    });

    it('Valid Response from OMDB-API with hardcoded imdbID', (done)=>{
        request('http://www.omdbapi.com/?apikey=9030182c&i=tt0275848', function (error, response, body) {
            let idSpecificMovieData = JSON.parse(body);
            // console.log(movieData)
            if(imdbIDSpecificElements.every(property=>{ return idSpecificMovieData.hasOwnProperty(property) }) ){
                done();
            }
        })
    });

})




