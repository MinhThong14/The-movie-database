const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const User = require("./UserModel");
const express = require('express');
const Movie = require("./MovieModel");
const People = require("./PeopleModel");
const Notification = require("./NotificationModel");
let router = express.Router();
const ObjectID = require('mongodb').ObjectID;



router.get("/", queryParser, loadUserAccount, loadMovie, respondMovie);
router.get("/addMovie", loadUserAccount, respondAdd);
router.get("/:mid", loadUserAccount, loadMovieById, respondMovie);
router.get("/search", loadUserAccount, getSearch);

router.post("/search", auth, loadUserAccount, express.json(), searchForMovie);
router.post("/addMovie", loadUserAccount, addMovie);
router.post("/:mid/addDirector", loadUserAccount, addDirector);
router.post("/:mid/addActor", loadUserAccount, addActor);
router.post("/:mid/addWriter", loadUserAccount, addWriter);
router.post("/:mid", loadUserAccount, addReview);





function queryParser(req, res, next){
	
	//build a query string to use for pagination later
	/*let params = [];
	for(prop in req.query){
		if(prop == "page"){
			continue;
		}
		params.push(prop + "=" + req.query[prop]);
	}
	req.qstring = params.join("&");*/
	
	let title = req.query.title;
	title = title.replace(/%20/g, " ");
	req.query.title = title;
	
	next();
}

function auth(req, res, next){
	if (!req.session.loggedin){
		res.status(401).send("Unauthorized");
		return;
	}
	next();
}

router.param("mid", function(req, res, next, value){
	let oid;
	try{
		oid = new ObjectID(value);
	}catch(err){
		res.status(404).send("Movie ID" + value + " does not exists.");
		return;
	}
	Movie.findById(oid, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading movie.");
			return;
		}
		if(!result){
			res.status(401).send("Movie ID" + value + " does not exist.");
			return;
		}
		req.movie = result;
		next();
	});
});

// load user account
function loadUserAccount(req, res, next){
	let id = req.session._id;
	let oid = new ObjectID(id);
	if (req.session.loggedin){
		User.findOne({_id: oid}, function(err, result){
			if(err){
				res.send(err);
			}else{
				req.userAccount = result;
				// handle recomended movies
				let viewedMovies = req.userAccount.viewedMovies;
				let recomMovies = [];
				viewedMovies.forEach(elem => {
					if(!recomMovies.includes(elem)){
						recomMovies.push(elem);
					}
				});
				
				// handle unread notifications
				let notifications = req.userAccount.notifications;
				let unRead = [];
				notifications.forEach(elem => {
					if(!elem.isRead){
						unRead.push(elem);
					}
				})

				req.recomMovies = recomMovies;
				req.notifications = unRead.reverse();
				req.numNotifications = unRead.length;
				next();
				return;
			}
		});
	}
	return;
}

function loadMovie(req, res, next){
	Movie.findOne({title:req.query.title}, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading movie.");
			return;
		}
		if(!result){
			res.status(401).send("Movie title" + req.query.title + "does not exist.");
			return;
		}
		let reviews = result.reviews;
		let sum = 0;
		let count = 0;
		let average = 0;
		reviews.forEach(elem => {
			sum += elem.rating;
			count++;
		});
		if(count > 0){
			average = sum/count;
		}
		req.movie = result;
		req.averageRating = average.toFixed(2);
		console.log(result);
		
		User.updateOne({username: req.userAccount.username}, {$push: {viewedMovies:req.movie.title}}, function(err, result){
			if(err){
				res.send(err);
			}
		});
		next();
		return;
	});

}

// functions that handle movie routers
// Load a movie by Id
function loadMovieById(req, res, next){
	let id = req.params.mid;
	let oid = new ObjectID(id);
	Movie.findById(oid, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading movie.");
			return;
		}
		let reviews = result.reviews;
		let sum = 0;
		let count = 0;
		let average = 0;
		reviews.forEach(elem => {
			sum += elem.rating;
			count++;
		});
		if(count > 0){
			average = sum/count;
		}
		req.movie = result;
		req.averageRating = average.toFixed(2);
		User.updateOne({username: req.userAccount.username}, {$push: {viewedMovies:req.movie.title}}, function(err, result){
			if(err){
				res.send(err);
			}
		});
		next();
		return;
	});
	return;

}

function addMovie(req, res, next){
	let body = req.body;
	if (!body.title || !body.year || !body.runtime || !body.plot || !body.genre || !body.director || !body.actor || !body.writer){
		res.status(401).send("Some fields aren't typed in");
		return;
	}
	Movie.exists({title: body.title}, function (err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading people.");
			return;
		}
		if(result){
			res.status(401).send("Movie " + body.title + " already exist.");
			return;
		}

		let newMovie = new Movie();
		newMovie.title = body.title;
		newMovie.year = body.year;
		newMovie.runtime = body.runtime;
		newMovie.plot = body.plot;
		newMovie.genre = body.genre;
		newMovie.reviews = [];

		//load directors
		let directorString = body.director;
		let currentDirectors = directorString.split(/\s*,\s*/);
		let directors = [];
		currentDirectors.forEach(people => {
			people = people.replace(/ *\([^)]*\) */g, "");
			directors.push(people);
		});
		
		// load actors
		let actorString = body.actor;
		let currentActors= actorString.split(/\s*,\s*/);
		let actors = [];
		currentActors.forEach(people => {
			people = people.replace(/ *\([^)]*\) */g, "");
			actors.push(people);
		});

		// load writers
		let writerString = body.writer;
		let currentWriters = writerString.split(/\s*,\s*/);
		let writers = [];
		currentWriters.forEach(people => {
			people = people.replace(/ *\([^)]*\) */g, "");
			writers.push(people);
		});
		
		newMovie.director = directors;
		newMovie.actor = actors;
		newMovie.writer = writers;

		//update movie to directors movie list
		directors.forEach(elem => {
			People.exists({name: elem}, function (err, result){
				if(err){
					console.log(err);
					res.status(500).send("Error reading people.");
					return;
				}
				if(!result){
					res.status(401).send("People " + elem + " doesn't exist in the database.");
					return
				}else{
					People.updateOne({name: elem}, {$push: {movies:newMovie.title, topCollaboration:newMovie.title}}, function(err, result){
						if(err){
							res.send(err);
						}
					});
					People.findOne({name:elem}, function(err, result){
						if(err){
							res.send(err);
						}
						let followedBy = result.followedBy;
						let peopleId = result._id;
						let name = result.name;
						followedBy.forEach(elem => {
							User.updateOne({_id:elem._id}, {$push: {notifications: {userId: peopleId, username:name, content:"add movie"}} }, function(err, result){
								if(err){
									res.send(err);
								}
							});
						});
					});
				}
				//update movie to writers movie list
				writers.forEach(elem => {
					People.exists({name: elem}, function (err, result){
						if(err){
							console.log(err);
							res.status(500).send("Error reading movie.");
							return;
						}
						if(!result){
							res.status(401).send("People " + elem + " doesn't exist in the database.");
							return;
						}else{
							People.updateOne({name: elem}, {$push: {movies:newMovie.title, topCollaboration:newMovie.title}}, function(err, result){
								if(err){
									res.send(err);
								}
							});
							People.findOne({name:elem}, function(err, result){
								if(err){
									res.send(err);
								}
								let followedBy = result.followedBy;
								let peopleId = result._id;
								let name = result.name;
								followedBy.forEach(elem => {
									User.updateOne({_id:elem._id}, {$push: {notifications: {userId: peopleId, username:name, content:"add movie"}} }, function(err, result){
										if(err){
											res.send(err);
										}
									});
								});
							});
						}

						//update movie to actors movie list
						actors.forEach(elem => {
							People.exists({name: elem}, function (err, result){
								if(err){
									console.log(err);
									res.status(500).send("Error reading movie.");
									return;
								}
								if(!result){
									res.status(401).send("People " + elem + " doesn't exist in the database.");
									return;
								}else{
									People.updateOne({name: elem}, {$push: {movies:newMovie.title, topCollaboration:newMovie.title}}, function(err, result){
										if(err){
											res.send(err);
										}
									});
									People.findOne({name:elem}, function(err, result){
										if(err){
											res.send(err);
										}
										let followedBy = result.followedBy;
										let peopleId = result._id;
										let name = result.name;
										followedBy.forEach(elem => {
											User.updateOne({_id:elem._id}, {$push: {notifications: {userId: peopleId, username:name, content:"add movie"}} }, function(err, result){
												if(err){
													res.send(err);
												}
											});
										});

										// add new movie to movie database
										newMovie.save(function(err, result){
											if(err){
												console.log(err);
											}
											console.log(result);
										});
										res.redirect("/movies?title="+newMovie.title);
										return;	
									});
								}
							});
						});
					});
				});
			});
		});
	});
	return;
}


function respondMovie(req, res, next){
    res.render("pages/viewingMovies.pug", {movie: req.movie, userAccount: req.userAccount, averageRating: req.averageRating, recomMovies : req.recomMovies, notifications: req.notifications, numNotifications: req.numNotifications});
    next();
}

function respondAdd(req, res, next){
	console.log("Send add movie");
	res.render("pages/addMovie.pug", {userAccount: req.userAccount, notifications: req.notifications, numNotifications: req.numNotifications});
}

function getSearch(req, res){
    res.render("pages/search.pug");
}

function searchForMovie(req, res){
	let body = req.body;
	let listOfMovies = [];

	if (body.choice === "title"){
		if (!body.searchMovie){
			res.status(401).send("Did not type a movie");
			return;
		}else{
			Movie.find({},function(err, results){
				if(err){
					res.status(500).send("Error reading movies.");
					console.log(err);
					return;
				}else if (!results){
					res.status(401).send("The movie doesn't exist.");
					return;
				}
				let title = body.searchMovie;
				title = title.toLowerCase();
				console.log(title);
				movies = [];
				results.forEach(elem=>{
					if(elem.title.toLowerCase() === title){
						movies.push(elem);
					}
				});
				res.movies = movies;
				console.log(res.movies);
				res.render("pages/search.pug", {movie: res.movies, userAccount: req.userAccount, notifications: req.notifications, numNotifications: req.numNotifications});
				return;
			});
		}
		
	}else if (body.choice === "year"){
		if (!body.searchMovie){
			res.status(401).send("Did not type a movie");
			return;
		}else{
			Movie.find({year: body.searchMovie}, function(err, results){
				if(err){
					res.status(500).send("Error reading movies.");
					console.log(err);
					return;
				}else if (!results){
					res.status(401).send("The movie doesn't exist.");
					return;
				}
				res.movies = results;
				console.log(res.movies);
				res.render("pages/search.pug", {movie: res.movies, userAccount: req.userAccount, notifications: req.notifications, numNotifications: req.numNotifications});
				return;
			});
		}
		
	}else if (body.choice === "genre"){
		if (!body.searchMovie){
			res.status(401).send("Did not type a movie");
			return;
		}else{
			Movie.find({}, function(err, results){
				if(err){
					res.status(500).send("Error reading movies.");
					console.log(err);
					return;
				}else if (!results){
					res.status(401).send("The movie doesn't exist.");
					return;
				}
				let genre = body.searchMovie;
				genre = genre.toLowerCase();
				let movies = [];
				results.forEach(elem => {
					if(elem.genre.map(v => v.toLowerCase()).includes(genre)){
						movies.push(elem);
					}
				});
				res.movies = movies;
				console.log(res.movies);
				res.render("pages/search.pug", {movie: res.movies, userAccount: req.userAccount, notifications: req.notifications, numNotifications: req.numNotifications});
				return;
			});	
		}
	}else if (!body.choice && !body.searchMovie){
		res.status(401).send("Did not type a movie and choose a search option");
		return;
	}else if (!body.choice){
		res.status(401).send("Did not choose a search option");
		return;
	}
}

// add review
function addReview(req, res, next){
	let body = req.body;
	let rating = body.rating;
	let comment = body.comments;

	// add review to user object list of reviews
	if (!body.rating  && !body.comments){
		res.status(401).send("Did not type both rating and comment");
		return;
	}else{
		let movieComment = {};
		movieComment.id = req.movie.id;
		movieComment.title = req.movie.title;
		movieComment.rating = rating;
		movieComment.comment = comment;

		req.userAccount.reviews.push(movieComment);

		let uid = new ObjectID(req.userAccount._id);
		let mid = new ObjectID(req.movie._id);
		
		// update user's review list
		Movie.findOne({_id:mid}, function(err, result){
			if(err){
				res.send(err);
			}
			User.updateOne({_id: uid}, {$push: {reviews:{movieId: mid, title: result.title, rating: rating, comment: comment}} },function(err, result){
				if(err){
					res.send(err);
				}
			});
		});
		

		// update movie review list
		User.findOne({_id:uid}, function(err, result){
			if(err){
				res.send(err);
			}
			Movie.updateOne({_id: mid}, {$push: {reviews:{userId: uid, username: result.username, rating: rating, comment: comment}} },function(err, result){
				if(err){
					res.send(err);
				}
			});
		});
		
		//averageRating(req.movie);
		res.redirect("/movies/"+req.movie._id);
		return;
	}
	return;
}

function addDirector(req, res, next){
	let body = req.body;
	if (!body.name){
		res.status(401).send("Some fields aren't typed in");
		return;
	}

	let name = body.name;
	let mid = new ObjectID(req.movie._id);

	// add people to people objects if they haven't appeared
	People.exists({name: name}, function (err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading people.");
			return;
		}
		if(!result){
			res.status(401).send("People " + name + " is not already exist in the database.");
			return;
		}
		Movie.updateOne({_id: mid}, {$push: {director:name}}, function(err, result){
			if(err){
				res.send(err);
			}
		});
		res.redirect("/movies/"+req.movie._id);
		return;
	});
	return;
}

function addWriter(req, res, next){
	let body = req.body;
	if (!body.name){
		res.status(401).send("Some fields aren't typed in");
		return;
	}

	let name = body.name;
	let mid = new ObjectID(req.movie._id);

	// add people to people objects if they haven't appeared
	People.exists({name: name}, function (err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading people.");
			return;
		}
		if(!result){
			res.status(401).send("People " + name + " is not already exist in the database.");
			return;
		}
		Movie.updateOne({_id: mid}, {$push: {writer:name}}, function(err, result){
			if(err){
				res.send(err);
			}
		});
		res.redirect("/movies/"+req.movie._id);
		return;
	});
	return;
}

function addActor(req, res, next){
	let body = req.body;
	if (!body.name){
		res.status(401).send("Some fields aren't typed in");
		return;
	}

	let name = body.name;
	let mid = new ObjectID(req.movie._id);

	// add people to people objects if they haven't appeared
	People.exists({name: name}, function (err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading people.");
			return;
		}
		if(!result){
			res.status(401).send("People " + name + " is not already exist in the database.");
			return;
		}
		Movie.updateOne({_id: mid}, {$push: {actor:name}}, function(err, result){
			if(err){
				res.send(err);
			}
		});
		res.redirect("/movies/"+req.movie._id);
		return;
	});
	return;
}



module.exports = router;