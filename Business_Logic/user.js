
// object that stores users' information
let userObjects = [{id: 0, username: "Tom", password: "1234", contributingUser: false, peopleFollow:[], userFollow:[{id: 1, username: "Jack"},{id: 4, username: "Ha"}], followedBy:[], reviews:[]},
				  {id: 1, username: "Jack", password: "1234", contributingUser: false, peopleFollow:[], userFollow:[], followedBy:[],reviews:[]},
				  {id: 2, username: "Dave", password: "1234", contributingUser: true, peopleFollow:[], userFollow:[],followedBy:[], reviews:[]},
				  {id: 3, username: "Lin", password: "1234", contributingUser: false, peopleFollow:[], userFollow:[],followedBy:[], reviews:[]},
				  {id: 4, username: "Ha", password: "1234", contributingUser: false, peopleFollow:[], userFollow:[], followedBy:[],reviews:[]},
				  {id: 5, username: "David", password: "1234", contributingUser: false, peopleFollow:[], userFollow:[],followedBy:[], reviews:[]},
				  {id: 6, username: "Pat", password: "1234", contributingUser: false, peopleFollow:[], userFollow:[], followedBy:[],reviews:[]},
				  {id: 7, username: "Smid", password: "1234", contributingUser: false, peopleFollow:[], userFollow:[],followedBy:[], reviews:[]}, 
				  {id: 8, username: "Jason", password: "1234", contributingUser: false, peopleFollow:[], userFollow:[],followedBy:[], reviews:[]}];

// object that stores people information
let peopleObjects = {directors: [{position: "directors", id: 0, name: "John Lasseter", movies : [{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], topCollaboration:[{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], followedBy:[]}, {position: "directors", id: 1, name: "Micheal", movies : [{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], topCollaboration:[{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], followedBy:[]}],
				     actors: [{position: "actors", id: 0, name: "Tom Hanks", movies : [{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], topCollaboration:[{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], followedBy:[]}],
					 writers: [{position: "writers", id: 0, name: "Pete Docter", movies : [{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], topCollaboration:[{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], followedBy:[]}]};

// object that store movies' information
let movieObjects = [{id: 0, title: "Toy Story", year:1995, released:"22 Nov 1995", runtime:"81 min", genre:"Animation, Adventure, Comedy, Family, Fantasy",  director:[{position: "director", id: 0, name: "John Lasseter"}], writer:[{postion: "writer", id: 0, name:"John Lasseter"}, {postion: "writer", id: 1, name:"Pete Docter"}], actors:[{postion: "actors", id: 0, name:"Tom Hanks"}, {postion: "actors", id: 1, name:"Tim Allen"}, {postion: "actors", id: 2, name:"Don Rickles"}, {postion: "actors", id: 3, name:"Jim Varney"}], plot:"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.", language:"English", country:"USA", awards:"Nominated for 3 Oscars. Another 27 wins & 20 nominations.", reviews:[{userID:1, value: 8.3, comment:"I am a big fan of the animated movies coming from the Pixar Studios. They are always looking for the newest technological possibilities to use in their movies, creating movies that are more than just worth a watch, even when they were made a decade ago."}, {userID:0, value: 7, comment:"This is a very clever animated story that was a big hit, and justifiably so. It had a terrific sequel and if a third film came out, that would probably be a hit, too."}, {userID:3, value: 9, comment:"When this came out, computer technology just was beginning to strut its stuff. Man, this looked awesome. Now, it's routine because animation, which took a giant leap with this movie, has made a lot more giant strides."}, {userID:7, value: 6, comment:"Toy Story is the film that started Pixar Animated Studios into its long string of never ending success. What Pixar does is not just absorb the younger demographic and keep the older ones mildly entertained."}], averageRating: 0 },
					{id: 1, title: "Star Wars",  year:1995, released:"22 Nov 1995", runtime:"81 min", genre:"Animation, Adventure, Comedy, Family, Fantasy",  director:[{position: "director", id: 0, name: "John Lasseter"}], writer:[{postion: "writer", id: 0, name:"John Lasseter"}, {postion: "writer", id: 1, name:"Pete Docter"}], actors:[{postion: "actors", id: 0, name:"Tom Hanks"}, {postion: "actors", id: 1, name:"Tim Allen"}, {postion: "actors", id: 2, name:"Don Rickles"}, {postion: "actors", id: 3, name:"Jim Varney"}], plot:"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.", language:"English", country:"USA", awards:"Nominated for 3 Oscars. Another 27 wins & 20 nominations.", reviews:[{userID:1, value: 8.3, comment:"I am a big fan of the animated movies coming from the Pixar Studios. They are always looking for the newest technological possibilities to use in their movies, creating movies that are more than just worth a watch, even when they were made a decade ago."}, {userID:0, value: 7, comment:"This is a very clever animated story that was a big hit, and justifiably so. It had a terrific sequel and if a third film came out, that would probably be a hit, too."}, {userID:3, value: 9, comment:"When this came out, computer technology just was beginning to strut its stuff. Man, this looked awesome. Now, it's routine because animation, which took a giant leap with this movie, has made a lot more giant strides."}, {userID:7, value: 6, comment:"Toy Story is the film that started Pixar Animated Studios into its long string of never ending success. What Pixar does is not just absorb the younger demographic and keep the older ones mildly entertained."}], averageRating: 0}] 

// Handling user id
let nextIdUser = 9;

// Handling people id who are directors
let nextDirectorId = 2;

// Handling people id who are actors
let nexActorsId = 1;

// Handling people id who are writers
let nextWritersId = 1;

// Handling movie id
let nextMovieId = 2;

function init(){
	document.getElementById("signIn").addEventListener("click", login);
}

// function that handle login feature
function login(){
	const username = document.getElementById("userName").value;
	const password = document.getElementById("password").value;
	let check = false;
	if (username.length == 0 && password.length == 0){
		alert("You must enter username and password");
		return;
	}else if(username.length == 0){
		alert("You must enter username");
		return;
	}else if(password.length == 0){
		alert("You must enter password");
		return;
	}else{
		userObjects.forEach(elem => {
			if(elem.username == username && elem.password == password){
				location.replace("./userAccount.html");
				check = true;
				return;
			}
		});
	}
	if (check == false){
		alert("You enter incorrect username or password");
	}
	return;
}

// function that check if a user exist
function doesExist(newUser){
	userObjects.forEach(user => {
		if(user.username === newUser.username){
			return true
		}
	})
	return false;
}

// function that handle sign up feature 
function createUser(addUser){
	if (addUser.username === null || addUser.password === null){
		return null;
	}
	if(doesExist(addUser)){
		return null;
	}
	
	let newUser = {}
	newUser.id = nextIdUser;
	nextIdUser++;
	newUser.username = addUser.username;
	newUser.password = addUser.password;
	newUser.contributingUser = false;
	newUser.peopleFollow = [];
	newUser.userFollow = [];
	newUser.followedBy = [];
	newUser.reviews = [];
	userObjects.push(newUser);

	console.log("Create a user")
	console.log("New user looks like")
	console.log(newUser);
	console.log("User DB looks like this now: ");
	console.log(userObjects);
	console.log("");
	console.log("");
}

// function that allow user to upgrade to a contributing user
function handleContributing(upgradeUser){
	
	console.log("Upgrade to contributing user or switch back to regular user:");
	console.log("User before do the switch");
	console.log(upgradeUser);

	let found = userObjects.find(function(elem){
		return elem.id === upgradeUser.id;
	})
	found.contributingUser = !found.contributingUser;

	console.log("User after do the switch: ");
	console.log(found);
	console.log("")
	console.log("");
}


// function that allow user follow other user
function followOtherUser(user, followUser){
	//add follow user to user follow list
	let found = userObjects.find(function(elem){
		return elem.id === user.id;
	});
	
	let follow = found.userFollow;
	let check = false;
	follow.forEach(elem =>{
		if (elem.id === followUser.id){
			check = true;
			return;
		}
	})
	if (!check){
		let followedUser = {}
		followedUser.id = followUser.id;
		followedUser.username = followUser.username;
		found.userFollow.push(followedUser);
	}

	// add user to followedBy list of followUser
	let foundFollowUser= userObjects.find(function(elem){
		return elem.id === followUser.id;
	});

	let followBy = foundFollowUser.followedBy;
	let checkFollow = false;
	followBy.forEach(elem =>{
		if (elem.id === user.id){
			checkFollow = true;
			return;
		}
	});
	if (!checkFollow){
		let followedByUser = {}
		followedByUser.id = user.id;
		followedByUser.username = user.username;
		foundFollowUser.followedBy.push(followedByUser);
	}
	console.log("Follow other user");
	console.log("User after follow other user: ")
	console.log(found);
	console.log("Followed user is:")
	console.log(foundFollowUser);
	console.log("");
	console.log("");
}

// function that allow user unfollow other user
function unFollowOtherUser(user, followUser){
	// unfollow user in follow list
	let found = userObjects.find(function(elem){
		return elem.id === user.id;
	});
	
	let follow = found.userFollow;
	let check = false;
	follow.forEach(elem =>{
		if (elem.id === followUser.id){
			check = true;
			return;
		}
	})
	if (check){
		let filtered = follow.filter(function(value, index, arr){
			return value.id != followUser.id;
		})
		found.userFollow = filtered;
	}

	// unfollow user to followedBy list
	let foundFollowUser= userObjects.find(function(elem){
		return elem.id === followUser.id;
	});

	let followBy = foundFollowUser.followedBy;
	let checkFollow = false;
	followBy.forEach(elem =>{
		if (elem.id === user.id){
			checkFollow = true;
			return;
		}
	});
	if (checkFollow){
		let filteredFollow = followBy.filter(function(value, index, arr){
			return value.id != user.id;
		})
		foundFollowUser.followedBy = filteredFollow;
	}
	console.log("Unfollow other user");
	console.log("User after follow other user: ")
	console.log(found);
	console.log("Unfollowed user is:")
	console.log(foundFollowUser);
	console.log("");
	console.log("");
}



// function that allows user to follow a people (director, writer, actors)
function followPeople(user, people){

	// Handling follow for user
	let found = userObjects.find(function(elem){
		return elem.id === user.id;
	});
	//postion of followed people 
	let position = people.position;
	let follow = found.peopleFollow;
	let check = false;
	follow.forEach(elem =>{
		if (elem.position === people.position && elem.id === people.id){
			check = true;
			return;
		}
	})
	if (!check){
		// add people
		let followedPeople = {}
		followedPeople.position = position;
		followedPeople.id = people.id;
		followedPeople.name = people.name;
		found.peopleFollow.push(followedPeople);
	}

	// Handling follow for people
	//if position is director
	//if position is actors
	//if position is writers
	let foundPeople = {};
	if (position === "directors"){
		foundPeople = peopleObjects.directors.find(function(elem){
			return elem.name = people.name;
		})
	}else if (position === "actors"){
		foundPeople = peopleObjects.actors.find(function(elem){
			return elem.name = people.name;
		})	
	}else if (position === "writers"){
		foundPeople = peopleObjects.writers.find(function(elem){
			return elem.name = people.name;
		})
	}
	let followedUsers = foundPeople.followedBy;
	let checkFollowers = false;
	followedUsers.forEach(elem =>{
		if(elem.id === user.id){
			checkFollowers = true;
			return;
		}
	})
	if (!checkFollowers){
		let followUser = {}
		followUser.id = user.id;
		followUser.username = user.username
		foundPeople.followedBy.push(followUser);
	}
	console.log("Follow people feature")
	console.log("Follow user:");
	console.log(found);
	console.log("Follow people:");
	console.log(foundPeople);
	console.log("");
	console.log("");
}

// function that allows user to unfollow a people (director, writer, actors)
function unFollowPeople(user, people){

	// Handling unfollow for user
	let found = userObjects.find(function(elem){
		return elem.id === user.id;
	});
	//postion of followed people 
	let position = people.position;
	let follow = found.peopleFollow;
	let check = false;
	follow.forEach(elem =>{
		if (elem.position === people.position && elem.id === people.id){
			check = true;
			return;
		}
	})
	if (check){
		// remove people
		let filtered = follow.filter(function(value, index, arr){
			return value.position != people.position && value.id != people.id;
		})
		found.peopleFollow = filtered;
	}

	// Handling unfollow for people
	//if position is director
	let foundPeople = {};
	if (position === "directors"){
		foundPeople = peopleObjects.directors.find(function(elem){
			return elem.name = people.name;
		})
	}else if (position === "actors"){
		foundPeople = peopleObjects.actors.find(function(elem){
			return elem.name = people.name;
		})	
	}else if (position === "writers"){
		foundPeople = peopleObjects.writers.find(function(elem){
			return elem.name = people.name;
		})
	}

	
	let followedUsers = foundPeople.followedBy;
	let checkFollowers = false;
	followedUsers.forEach(elem =>{
		if(elem.id === user.id){
			checkFollowers = true;
			return;
		}
	})
	if (checkFollowers){
		let filteredFollow = followedUsers.filter(function(value, index, arr){
			return value.id != user.id;
		})	
		foundPeople.followedBy = filteredFollow;
	}
	console.log("Unfollow people feauture")
	console.log("Follow user:");
	console.log(found);
	console.log("Follow people:");
	console.log(foundPeople);
	console.log("");
	console.log("");
}



// function that allow user to review a movie
function reviewMovie(user, movie, comment, rating){
	// add comment to user comments' list
	let found = userObjects.find(function(elem){
		return elem.username === user.username;
	});
	let commentList = found.reviews;
	let movieComment = {}
	movieComment.id = movie.id;
	movieComment.title = movie.title;
	movieComment.comment = comment;
	movieComment.rating = rating;
	commentList.push(movieComment);

	// add comment to movie comments' list
	let foundMovie = movieObjects.find(function(elem){
		return elem.title === movie.title;
	});
	let userComment = {}
	userComment.id = user.id;
	userComment.username = user.username;
	userComment.comment = comment;
	userComment.rating = rating;
	foundMovie.reviews.push(userComment);

	console.log("Add reviews")
	console.log("User who add review looks like:")
	console.log(found);
	console.log("Now reviewed movie looks like:")
	console.log(foundMovie);
	console.log("");
	console.log("");
}

// function that allow contributing user to add a new person to the database
function addPeople(people){
	// check if the the people is existed in the database
	let check = false;
	if (people.position === "directors"){
		let objects = peopleObjects.directors;
		objects.forEach(elem => {
			if(elem.name === people.name){
				check = true;
			}
		})
	} else if (people.position === "actors"){
		let objects = peopleObjects.actors;
		objects.forEach(elem => {
			if(elem.name === people.name){
				check = true;
			}
		})
	} else if (people.position === "writers"){
		let objects = peopleObjects.writers;
		objects.forEach(elem => {
			if(elem.name === people.name){
				check = true;
			}
		})
	}
	if (!check){
		if (people.position === "directors"){
			let addPeople = {};
			addPeople.position = "directors";
			addPeople.id = nextDirectorId;
			nextDirectorId++;
			addPeople.name = people.name;
			addPeople.movies = [];
			addPeople.topCollaboration = [];
			addPeople.followedBy = [];
			peopleObjects.directors.push(addPeople);

			console.log("Add a people if the user is a contributing user")
			console.log("Added people")
			console.log(addPeople);
			console.log("Now people DB looks like:")
			console.log(peopleObjects);
			console.log("");
			console.log("");

		}else if (people.position === "actors"){
			let addPeople = {};
			addPeople.position = "actors";
			addPeople.id = nexActorsId;
			nexActorsId++;
			addPeople.name = people.name;
			addPeople.movies = [];
			addPeople.topCollaboration = [];
			addPeople.followedBy = [];
			peopleObjects.actors.push(addPeople);

			console.log("Add a people if the user is a contributing user")
			console.log("Added people")
			console.log(addPeople);
			console.log("Now people DB looks like:")
			console.log(peopleObjects);
			console.log("");
			console.log("");


		}else if (people.position === "writers"){
			let addPeople = {};
			addPeople.position = "writers";
			addPeople.id = nextWritersId;
			nextWritersId++;
			addPeople.name = people.name;
			addPeople.movies = [];
			addPeople.topCollaboration = [];
			addPeople.followedBy = [];
			peopleObjects.writers.push(addPeople);

			console.log("Add a people if the user is a contributing user")
			console.log("Added people")
			console.log(addPeople);
			console.log("Now people DB looks like:")
			console.log(peopleObjects);
			console.log("");
			console.log("");
		}
	}
	
}

// function that allow contrubuting user to add movie to the database
// people (directors, writers, actors) are added if they showed up in the database
function addMovie(movie){
	let check = false;
	movieObjects.forEach(elem => {
		if(elem.title === movie.title){
			check = true;
		}
	})
	if (!check){
		// add directors
		let addDirectors = [];
		let directors = movie.director;
		let directorObjects = peopleObjects.directors;
		directors.forEach(director =>{
			let found = directorObjects.find(function(elem){
				return elem.name === director.name;
			});
			if (found){
				addDirectors.push(found);
			}
			
		});
		// add writers 
		let addWriters = [];
		let writers = movie.writer;
		let writerObjects = peopleObjects.writers;
		writers.forEach(writer =>{
			let found = writerObjects.find(function(elem){
				return elem.name === writer.name;
			});
			if (found){
				addWriters.push(found);
			}
			
		});
		//add actors
		let addActors = [];
		let actors = movie.actors;
		let actorObjects = peopleObjects.actors;
		actors.forEach(actor =>{
			let found = actorObjects.find(function(elem){
				return elem.name === actor.name;
			});
			if (found){
				addActors.push(found);
			}
		});
		// A new movie object into movie database
		let addMovie = {}
		addMovie.id = nextMovieId;
		nextMovieId++;
		addMovie.title = movie.title;
		addMovie.year = movie.year;
		addMovie.runtime = movie.runtime;
		addMovie.genre = movie.genre;
		addMovie.director = addDirectors;
		addMovie.writer = addWriters;
		addMovie.actors = addActors;
		addMovie.reviews = [];
		addMovie.averageRating = 0;
		movieObjects.push(addMovie);

		console.log("Add movie");
		console.log("Added movie looks like")
		console.log(addMovie);
		console.log("Now movie DB looks like:")
		console.log(movieObjects);
		console.log("");
		console.log("");
	}
	
}

// function that allow contibuting user to edit movie by adding actors, writers or directors as long as they are in peope database
function editMovie(movie){
	let directors = movie.director;
	let writers = movie.writer;
	let actors = movie.actors;
	movieObjects.forEach(elem =>{
		if (elem.title === movie.title){
			// add directors if there are directors in edit content
			if (directors){
				let addDirectors = elem.director;
				let directorObjects = peopleObjects.directors;
				directors.forEach(director =>{
					let found = directorObjects.find(function(elem){
						return elem.name === director.name;
					});
					if (found){
						addDirectors.push(found);
					}
					
				});
				elem.director = addDirectors;
			}
			// add writers if there are writers in edit content
			if (writers){
				let addWriters = elem.writer;
				let writerObjects = peopleObjects.writers;
				writers.forEach(writer =>{
					let found = writerObjects.find(function(elem){
						return elem.name === writer.name;
					});
					if (found){
						addWriters.push(found);
					}
				});
				elem.writer = addWriters;
			}
			//add actors if there are actors in edit contents
			if (actors){
				let addActors = elem.actors;
				let actorObjects = peopleObjects.actors;
				actors.forEach(actor =>{
					let found = actorObjects.find(function(elem){
						return elem.name === actor.name;
					});
					if (found){
						addActors.push(found);
					}
				});
				if (actors){
					
				}
				elem.actors = addActors;
			}
			console.log("Edit movie");
			console.log("Editted movie looks like:")
			console.log(elem);
			console.log("");
			console.log("");
			return;
		}
	});
	
	
	
}

// Test createUser function
createUser({username: "Kitty", password:"3456"});

// Test upgradeToContriButing function
let userInput = {id: 1, username: "Jack", password: "1234", contributingUser: false, peopleFollow:[], userFollow:[], comments:[]}
handleContributing(userInput);

// Test switch back to regular user
let userInput1 = {id: 2, username: "Dave", password: "1234", contributingUser: true, peopleFollow:[], userFollow:[],followedBy:[], reviews:[]}
handleContributing(userInput1);

// Test followOtherUser function
let follow = {id: 2, username: "Dave", password: "1234", contributingUser: true, peopleFollow:[], userFollow:[], comments:[]}
let follow1 = {id: 4, username: "Ha", password: "1234", contributingUser: true, peopleFollow:[], userFollow:[], comments:[]}
followOtherUser(userInput, follow);
followOtherUser(userInput, follow1);

// Test unFollowOtherUser function 
unFollowOtherUser(userInput, follow);

// Test followPeople function
let followPeopleObject = {position: "directors", id: 0, name: "John Lasseter", movies : [{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], topCollaboration:[{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], followedBy:[]};
followPeople(userInput, followPeopleObject);

let followPeopleObject2 = {position: "actors", id: 0, name: "Tom Hanks", movies : [{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], topCollaboration:[{id:0, name: "ava"}, {id:1, name: "007"}, {id:2, name: "Enola Holmes"}], followedBy:[]};
let userInput2 = {id: 2, username: "Dave", password: "1234", contributingUser: true, peopleFollow:[], userFollow:[], comments:[]}; 
followPeople(userInput2, followPeopleObject2);

// Test unfollowPeople function
unFollowPeople(userInput2, followPeopleObject2);

// Test reviewMovie function
let movie = {id: 0, title: "Toy Story",  year:1995, released:"22 Nov 1995", runtime:"81 min", genre:"Animation, Adventure, Comedy, Family, Fantasy",  director:[{position: "director", id: 0, name: "John Lasseter"}], writer:[{postion: "writer", id: 0, name:"John Lasseter"}, {postion: "writer", id: 1, name:"Pete Docter"}], actors:[{postion: "actors", id: 0, name:"Tom Hanks"}, {postion: "actors", id: 1, name:"Tim Allen"}, {postion: "actors", id: 2, name:"Don Rickles"}, {postion: "actors", id: 3, name:"Jim Varney"}], plot:"A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.", language:"English", country:"USA", awards:"Nominated for 3 Oscars. Another 27 wins & 20 nominations.", reviews:[{userID:1, value: 8.3, comment:"I am a big fan of the animated movies coming from the Pixar Studios. They are always looking for the newest technological possibilities to use in their movies, creating movies that are more than just worth a watch, even when they were made a decade ago."}, {userID:0, value: 7, comment:"This is a very clever animated story that was a big hit, and justifiably so. It had a terrific sequel and if a third film came out, that would probably be a hit, too."}, {userID:3, value: 9, comment:"When this came out, computer technology just was beginning to strut its stuff. Man, this looked awesome. Now, it's routine because animation, which took a giant leap with this movie, has made a lot more giant strides."}, {userID:7, value: 6, comment:"Toy Story is the film that started Pixar Animated Studios into its long string of never ending success. What Pixar does is not just absorb the younger demographic and keep the older ones mildly entertained."}], reviews:[], averageRating: 0};
let comment = "Toy Story is the film that started Pixar Animated Studios into its long string of never ending success. What Pixar does is not just absorb the younger demographic and keep the older ones mildly entertained.";
let rating = 7
reviewMovie(userInput, movie, comment, rating);

// Test addPeople(people)
let testPeople = {position: "actors", name: "Nguyen"};
addPeople(testPeople);

// Test addMovie(movie)
let movie1 = {title: "Tom and Jerry",  year:1997, runtime:"45 min", genre:"Animation, Comedy, Family",  director:[{name: "John Lasseter"}], writer:[{name:"Pete Docter"}], actors:[{name:"Tom Hanks"}, {name: "Nguyen"}]};
addMovie(movie1);

// Test editMovie(movie)
let editContent = {title: "Star Wars", director:[{name: "Micheal"}], writer:[], actors:[]};
editMovie(editContent)





