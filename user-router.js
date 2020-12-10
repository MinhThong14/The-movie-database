const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId;
const ObjectID = require('mongodb').ObjectID;
const User = require("./UserModel");
const People = require("./PeopleModel");
const Notification = require("./NotificationModel");
const express = require('express');
let router = express.Router();


router.get("/contributingUser", loadUserAccount, respondContributingUsers);
router.get("/viewingOtherUsers", respondViewingOtherUsers);
router.get("/userAccount", loadUserAccount, sendAccount);
router.get("/:uid", loadUserAccount, loadUserById, sendSingleUser);


router.post("/contributingUser", loadUserAccount, changeContributing);
router.post("/cancelContributingUser", loadUserAccount, changeContributing);

router.post("/followOtherUser/:uid", loadUserAccount, followOtherUser);
router.post("/unFollowOtherUser/:uid", loadUserAccount, unFollowOtherUser);

router.post("/followAPerson/:pid", loadUserAccount, followAPerson);
router.post("/unFollowAPerson/:pid", loadUserAccount, unFollowAPerson);
router.post("/notification/:nid", loadUserAccount, readNotification);


/*
router.param("uid", function(req, res, next, value){
	let oid;
	try{
		oid = new ObjectID(value);
	}catch(err){
		res.status(404).send("User ID" + value + "does not exists.");
		return;
	}
	User.findById(oid, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading movie.");
			return;
		}
		if(!result){
			res.status(401).send("User ID" + value + "does not exist.");
			return;
		}
		
		console.log(result);
		console.log("req id is:"+req.userAccount._id);
		let checkFollow = false;
		result.followedBy.forEach(elem => {
			if(elem.equals(req.userAccount._id)){
				checkFollow = true;
			}
		});

		req.user = result;
		req.checkFollow = checkFollow;
		next();
	});
});
*/

// functions that handle users' routers
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

function loadUserById(req, res, next){
	let oid = new ObjectID(req.params.uid);

	User.findById(oid, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading movie.");
			return;
		}
		if(!result){
			res.status(401).send("User ID" + value + "does not exist.");
			return;
		}
		
		
		console.log("req id is:"+req.userAccount._id);
		let checkFollow = false;
		result.followedBy.forEach(elem => {
			if(elem.equals(req.userAccount._id)){
				checkFollow = true;
			}
		});

		req.user = result;
		req.checkFollow = checkFollow;
		next();
	});
}


function loadFollowPeople(req, res, next){
    //console.log(req.params.uid);
	if (req.session.loggedin){
		let followPeople = []
		req.userAccount.peopleFollow.forEach(elem => {
			let oid = new ObjectID(elem);
			People.findOne({_id:oid}, function(err, result){
				if(err){
					res.send(err);
				}else{
					let people = {};
					people._id = elem;
					people.name = result.name;
					console.log(people);
					followPeople.push(people);
				}
			});
		});
		console.log(followPeople);
		req.followPeople = followPeople;
		next;
		return;
	}
	return;
}

// change contributing status
function changeContributing(req, res){
	let status = req.userAccount.contributingUser; 
	req.userAccount.contributingUser = !status;
	User.updateOne({username: req.userAccount.username}, {contributingUser: req.userAccount.contributingUser},function(err, result){
		if(err){
			res.send(err);
		}
	});
	User.findOne({username: req.userAccount.username}, function(err, result){
		if(err){
			res.send(err);
		}
		console.log(result);
	});
	console.log("Name is: "+req.userAccount.username);
	console.log("The status of user is: "+req.userAccount.contributingUser);
	res.redirect("/users/userAccount");
	return
}




// follow other user
function followOtherUser(req, res){

	// add current user to user followed by list
	let uid = new ObjectID(req.userAccount._id);
	let id = req.params.uid;
	let oid = new ObjectID(id);
	User.findOne({_id:uid}, function(err, result){
		if(err){
			res.send(err);
		}
		User.updateOne({_id: oid}, {$push: {followedBy:{_id: uid, username: result.username}} },function(err, result){
			if(err){
				res.send(err);
			}
		});
	});
	
	// add people to user follow list of current people
	User.findOne({_id:oid}, function(err, result){
		if(err){
			res.send(err);
		}
		User.updateOne({_id: uid}, {$push: {userFollow:{_id: id, username: result.username}} },function(err, result){
			if(err){
				res.send(err);
			}
		});
	});

	// add notification
	User.updateOne({_id:oid}, {$push: {notifications: {userId: req.userAccount._id, username:req.userAccount.username, content:"follow"}} }, function(err, result){
		if(err){
			res.send(err);
		}
	});

	res.redirect("/users/"+oid);
	return;
}

// Unfollow other user
function unFollowOtherUser(req, res, next){
	// add current user to user followed by list
	let uid = new ObjectID(req.userAccount._id);
	let id = req.params.uid;
	let oid = new ObjectID(id);
	User.findOne({_id:uid}, function(err, result){
		if(err){
			res.send(err);
		}
		User.updateOne({_id: oid}, {$pull: {followedBy:{_id: uid, username: result.username}} },function(err, result){
			if(err){
				res.send(err);
			}
		});
	});
	
	// add people to user follow list of current people
	User.findOne({_id:oid}, function(err, result){
		if(err){
			res.send(err);
		}
		User.updateOne({_id: uid}, {$pull: {userFollow:{_id: id, username: result.username}} },function(err, result){
			if(err){
				res.send(err);
			}
		});
	});
	// add notifications
	User.updateOne({_id:oid}, {$push: {notifications: {userId: req.userAccount._id, username:req.userAccount.username, content:"unfollow"}} }, function(err, result){
		if(err){
			res.send(err);
		}
	});

	res.redirect("/users/"+oid);
	return;
}

// send an account
function sendAccount(req, res, next){
	res.render("pages/userAccount.pug", {userAccount : req.userAccount, recomMovies : req.recomMovies, notifications: req.notifications, numNotifications: req.numNotifications});
	return;
}

function sendSingleUser(req, res, next){
	res.render("pages/viewingOtherUsers.pug", {userAccount: req.userAccount, user : req.user, checkFollow:req.checkFollow, notifications: req.notifications, numNotifications: req.numNotifications});
	return;
}

// follow a people
function followAPerson(req, res){
	let uid = new ObjectID(req.userAccount._id);
	let id = req.params.pid;
	let oid = new ObjectID(id);
	User.findOne({_id:uid}, function(err, result){
		if(err){
			res.send(err);
		}
		People.updateOne({_id: oid}, {$push: {followedBy:{_id: uid, username: result.username}} },function(err, result){
			if(err){
				res.send(err);
			}
		});
	});
	
	// update person to user's follow list
	People.findOne({_id: oid}, function(err, result){
		if(err){
			res.send(err);
		}
		User.updateOne({username: req.userAccount.username}, {$push: {peopleFollow:{_id: oid, name: result.name}} },function(err, result){
			if(err){
				res.send(err);
			}
			console.log(result);
		});
		res.redirect("/people?name="+result.name);
	});
	return
}

// Unfollow a director
function unFollowAPerson(req, res, next){
	let uid = new ObjectID(req.userAccount._id);
	User.findOne({_id:uid}, function(err, result){
		if(err){
			res.send(err);
		}
		People.updateOne({_id: oid}, {$pull: {followedBy:{_id: uid, username: result.username}} },function(err, result){
			if(err){
				res.send(err);
			}
		});
	});
	
	// update person to user's follow list
	let id = req.params.pid;
	let oid = new ObjectID(id);
	People.findOne({_id: oid}, function(err, result){
		if(err){
			res.send(err);
		}
		User.updateOne({username: req.userAccount.username}, {$pull: {peopleFollow:{_id: oid, name: result.name}} },function(err, result){
			if(err){
				res.send(err);
			}
			console.log(result);
		});
		res.redirect("/people?name="+result.name);
	});
	return
}

// read notification
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
		let userId = "";
		notifications.forEach(elem => {
			if(elem._id.equals(oid)){
				userId = elem.userId;
			}
		})
		console.log("notification user is " + userId);
		res.redirect("/users/"+userId);
	});

	return
}

// function that update to contributing user


/*function respondUsers(req, res, next){
    res.render("pages/userAccount.pug", {user : userObjects[0]});
    next();
}*/

function respondContributingUsers(req, res, next){
    res.render("pages/contributingUser.pug", {userAccount: req.userAccount, notifications: req.notifications, numNotifications: req.numNotifications});
    next();
}

function respondViewingOtherUsers(req, res){
	res.render("pages/viewingOtherUsers.pug", {notifications: req.notifications, numNotifications: req.numNotifications});
}


module.exports = router;