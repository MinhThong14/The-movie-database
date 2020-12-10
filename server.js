const express = require('express');
const path = require('path');

const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
	uri: 'mongodb://localhost:27017/tokens',
	collection: 'sessions'
});
const User = require("./UserModel");
const Movie = require("./MovieModel");
const People = require("./PeopleModel");
const Notification = require("./NotificationModel");
const fs = require("fs");
const csv = require("csv-parser");



app.use(session({secret : 'some secret here', store: store}));
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


app.set("view engine", "pug");

//get pages
app.get("/",getHome);
app.get("/signInAccount",getSignIn);
app.get("/signUpAccount",getSignUp);
app.get("/logOut", logOut);

//login
app.post("/signInAccount", login);
// signup
app.post("/signUpAccount", express.json(), signUp);

// User routers
let userRouter = require("./user-router");
app.use("/users", userRouter);


// Movie routers
let movieRouter = require("./movie-router");
app.use("/movies", movieRouter);

// People routers
let peopleRouter = require("./people-router");
app.use("/people", peopleRouter);

function auth(req, res, next){
	if (!req.session.loggedin){
		res.status(401).send("Unauthorized");
		return;
	}
	next();
}



//login
function login(req, res, next){
	let body = req.body;
	
	User.findOne({username: body.username , password: body.password}, function(err, result){
		if(err){
			res.send(err);
		}if (result){
			console.log(result);
			req.userAccount = result;
			req.session.loggedin = true;
			req.session.username = result.username;
			req.session._id = result._id;
			console.log("Username: " + result.username);
			console.log("Id: " + result._id);
			res.redirect("/users/userAccount");
			return;
		}else{
			res.status(401).send("Not authorized. Invalid username or password");
			return;
		}
	});
	
}

// sign up an account
function doesExist(newUser){
	userObjects.forEach(user => {
		if(user.username === newUser.username){
			return true
		}
	})
	return false;
}

function signUp(req, res, next){
	let body = req.body;
	let u = new User();
	u.username = body.addUsername;
	u.password = body.addPassword;
	u.contributingUser = false;
	u.peopleFollow = [];
	u.userFollow = [];
	u.followedBy = [];
	u.reviews = [];
	u.viewedMovies = [];

	User.exists({username: body.addUsername}, function(err, result){
		if (err){
			res.send(err);
		}else if (!result){
			u.save(function(err, result){
				if(err){
					console.log(err);
					res.status(500).send("Error sign up user.");
					return;
				}
				req.session.loggedin = true;
				req.session.username = u.username;
				req.session._id = u._id;
				res.redirect("/users/userAccount");
				next();
				return;
			});	
		}else{
			res.send("The user is already exist");
		}
	});
}

function logOut(req, res, next){
	req.session.loggedin = false;
	res.redirect("/");
}


function getHome(req, res){
	res.render("pages/index.pug");
}

function getSignIn(req, res){
	res.render("pages/signInAccount.pug");
}

function getSignUp(req, res){
	res.render("pages/signUpAccount.pug");
}

//Start server and database
mongoose.connect('mongodb://localhost/store', {useNewUrlParser: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  let people = [];
  People.find(function(err, results){
    console.log("Find all people");
  });
	app.listen(3000);
	console.log("Server listening on port 3000");
});

/*app.listen(3000);
console.log("Server listening on port 3000");*/