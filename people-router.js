const mongoose = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId
const ObjectID = require('mongodb').ObjectID;
const User = require("./UserModel");
const express = require('express');
let router = express.Router();
const Movie = require("./MovieModel");
const People = require("./PeopleModel");
const Notification = require("./NotificationModel");



router.get("/", queryParser, loadUserAccount, loadPeople, sendPeople);
router.get("/addPeople", loadUserAccount, sendAddPeople);
router.post("/addPeople", loadUserAccount, addPeople);
router.post("/notification/:nid", loadUserAccount, readNotification);



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

// load recommmended movie
function loadRecommendedMovie(req, res, next){
	let peopleFollow = req.userAccount.peopleFollow;
	let recommendedMovie = [];
	peopleFollow.forEach(elem => {
		
	});
}

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
	
	let name = req.query.name;
	name = name.replace(/%20/g, " ");
	req.query.name = name;
	
	next();
}

// Load a people
function loadPeople(req, res, next){
	People.findOne({name:req.query.name}, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading movie.");
			return;
		}
		if(!result){
			res.status(401).send("People" + req.query.name+ "does not exist.");
			return;
		}
		req.people = result;
		let checkFollow = false;
		result.followedBy.forEach(elem => {
			if(elem.equals(req.userAccount._id)){
				checkFollow = true;
			}
		});

		let topCollaboration = [];
		let count = 0;
		let top = result.topCollaboration; 
		top = top.reverse();
		top.forEach(elem =>{
			if (count < 5){
				topCollaboration.push(elem);
			}
			count++;
		});

		req.checkFollow = checkFollow;
		req.topCollaboration = topCollaboration;
		console.log("Top collaboration: "+req.topCollaboration);
		console.log(result);
		next();
	});

}

// function that handle people routers
// Load director
function loadDirectById(req, res, next){
	console.log(req.params.pid);
	let id = req.params.pid;
	peopleObjects.directors.forEach(people => {
		if (people.id == id){
			req.people = people;
            console.log("There is a users with id: "+ req.people.id);
            console.log(req.people.followedBy);
			next();
			return;
		}
	});
	console.log("There is no user");
	return;

}

// Load actor
function loadActById(req, res, next){
	console.log(req.params.pid);
	let id = req.params.pid;
	peopleObjects.actors.forEach(people => {
		if (people.id == id){
			req.people = people;
            console.log("There is a users with id: "+ req.people.id);
            console.log(req.people.followedBy);
			next();
			return;
		}
	});
	console.log("There is no user");
	return;

}

// Load a writer
function loadWritById(req, res, next){
	console.log(req.params.pid);
	let id = req.params.pid;
	peopleObjects.writers.forEach(people => {
		if (people.id == id){
			req.people = people;
            console.log("There is a users with id: "+ req.people.id);
            console.log(req.people.followedBy);
			next();
			return;
		}
		
	});
	console.log("There is no user");
	return;

}

function addPeople(req, res, next){
	let body = req.body;
	if (!body.name || !body.position || !body.movie || !body.bio){
		res.status(401).send("Some fields aren't typed in");
		return;
	}

	let name = body.name;
	let position = body.position.toLowerCase();
	let movie = body.movie;
	let bio = body.bio;

	// add people to people objects if they haven't appeared
	People.exists({name: name}, function (err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading people.");
			return;
		}
		if(result){
			res.status(401).send("People " + name + " already exist.");
			return;
		}
		let newPeople = new People();
		newPeople.name = name;
		newPeople.bio = bio;
		newPeople.movies = [movie];
		newPeople.topCollaboration = [movie];
		newPeople.followedBy = [];
		newPeople.save(function(err, result){
			if(err){
				console.log(err);
			}
			console.log(result);
		});
		// add people to movie list of directors/writers/actors
		Movie.exists({title: movie}, function (err, result){
			if(err){
				console.log(err);
				res.status(500).send("Error reading movie.");
				
			}
			if(!result){
				res.status(401).send("Movie " + movie + "doesn't exist.");
				
			}
			console.log(result);
			
			if (position === "director"){
				Movie.updateOne({title: movie}, {$push: {director:name}}, function(err, result){
					if(err){
						res.send(err);
					}
				});
				
			}else if (position === "writer"){
				Movie.updateOne({title: movie}, {$push: {writer:name}}, function(err, result){
					if(err){
						res.send(err);
					}
				});
			}else if (position === "actor"){
				Movie.updateOne({title: movie}, {$push: {actor:name}}, function(err, result){
					if(err){
						res.send(err);
					}
				});
			}
		});
		res.redirect("/users/userAccount");
		return;
	});
	return;
}

function readNotification(req, res){
	//userId
	let uid = new ObjectID(req.userAccount._id);
	//notificationId
	let id = req.params.nid;
	let oid = new ObjectID(id);
	User.updateOne({"_id": uid, "notifications._id": oid}, {$set: {"notifications.$.isRead": true} },function(err, result){
		if(err){
			res.send(err);
		}
	});
	
	User.findOne({"_id": uid},function(err, result){
		if(err){
			res.send(err);
		}
		console.log(result);
		let notifications = result.notifications;
		let peopleName = "";
		notifications.forEach(elem => {
			if(elem._id.equals(oid)){
				peopleName = elem.username;
			}
		})
		console.log("notification user is " + peopleName);
		res.redirect("/people?name="+peopleName);
	});
	return
}

// Send a director
function sendPeople(req, res, next){
    res.render("pages/viewingPeople.pug", {userAccount: req.userAccount, people: req.people, topCollaboration:req.topCollaboration, checkFollow:req.checkFollow, notifications: req.notifications, numNotifications: req.numNotifications});
    next();
}

function sendAddPeople(req, res, next){
    res.render("pages/addPeople.pug", {userAccount: req.userAccount, notifications: req.notifications, numNotifications: req.numNotifications});
}

module.exports = router;