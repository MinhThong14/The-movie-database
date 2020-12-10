
const mongoose = require('mongoose');
const Movie = require("./MovieModel");
const People = require("./PeopleModel");
const fs = require("fs");
const csv = require('csv-parser');
const results = [];
const ObjectID = require('mongodb').ObjectID;
const path = require("path");

//load movies
let movies = JSON.parse(fs.readFileSync("movie-data.json"));

//Create and save movies
let movieList = [];
let peopleList = [];
movies.forEach(movie => {
    let m = new Movie();
    m.title = movie.Title;
    m.year = movie.Year;
    m.runtime = movie.Runtime;
    m.plot = movie.Plot;
    

    //load genre
    let genreString = movie.Genre;
    let currentGenres = genreString.split(/\s*,\s*/);
    let genres = [];
    currentGenres.forEach(genre => {
        genre = genre.replace(/ *\([^)]*\) */g, "");
        genres.push(genre);
    });


    //load directors
    let directorString = movie.Director;
    let currentDirectors = directorString.split(/\s*,\s*/);
    let directors = [];
    currentDirectors.forEach(people => {
        people = people.replace(/ *\([^)]*\) */g, "");
        directors.push(people);
    });

    // load writers
    let writerString = movie.Writer;
    let currentWriters = writerString.split(/\s*,\s*/);
    let writers = [];
    currentWriters.forEach(people => {
        people = people.replace(/ *\([^)]*\) */g, "");
        writers.push(people);
    });

    // load actors
    let actorString = movie.Actors;
    let currentActors= actorString.split(/\s*,\s*/);
    let actors = [];
    currentActors.forEach(people => {
        people = people.replace(/ *\([^)]*\) */g, "");
        actors.push(people);
    });

    
    // merge director, actor, writer to a list of non duplicate people
    let mergePeople = [];
    directors.forEach(people => {
        mergePeople.push(people);
    });

    writers.forEach(people =>{
        if(!mergePeople.includes(people)){
            mergePeople.push(people);
        }
    });

    actors.forEach(people =>{
        if(!mergePeople.includes(people)){
            mergePeople.push(people);
        }
    });
    
    mergePeople.forEach(people =>{
        let checkExist = false;
        peopleList.forEach(object =>{
            if(object.name === people){
                checkExist = true;
                existObject = object;
                return;
            }
        });
        
        if (checkExist === false){
            let newPeople = new People();
            newPeople.name = people;
            newPeople.bio = "";
            newPeople.movies = [movie.Title];
            newPeople.topCollaboration = [movie.Title];
            newPeople.followedBy = [];
            
            peopleList.push(newPeople);
        }
        
        else{
            peopleList.forEach(object =>{
                if(object.name === people){
                    console.log(object);
                    object.movies.push(m.title);
                    object.topCollaboration.push(m.title);
                    return;
                }
            });
        }
        
    });
    m.genre = genres;
    m.director = directors;
    m.writer = writers;
    m.actor = actors;
    m.reviews = [];
    m.averageRating = 0;
    movieList.push(m);
});



mongoose.connect('mongodb://localhost/store', {useNewUrlParser: true});
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	mongoose.connection.db.dropDatabase(function(err, result){
		if(err){
			console.log("Error dropping database:");
			console.log(err);
			return;
		}
        console.log("Dropped database. Starting re-creation.");

        // save movie to database
        movieList.forEach(movie =>{
            movie.save(function(err, result){
                if(err){
                    console.log(err);
                    return;
                }
                return;
            });	
        });

        peopleList.forEach(people => {
            people.save(function(err, result){
                if(err){
                    console.log(err);
                    return;
                }
                return;
            });	
        });
    });
});

