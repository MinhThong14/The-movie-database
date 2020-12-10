
// object that stores movies' information
let movieObjects = [{
    id: 0,
    title: 'Toy Story',
    year: 1995,
    released: '22 Nov 1995',
    runtime: '81 min',
    genre: 'Animation, Adventure, Comedy, Family, Fantasy',
    director: [ { position: 'director', id: 0, name: 'John Lasseter' } ],
    writer: [
      { postion: 'writer', id: 0, name: 'John Lasseter' },
      { postion: 'writer', id: 1, name: 'Pete Docter' }
    ],
    actors: [
      { postion: 'actors', id: 0, name: 'Tom Hanks' },
      { postion: 'actors', id: 1, name: 'Tim Allen' },
      { postion: 'actors', id: 2, name: 'Don Rickles' },
      { postion: 'actors', id: 3, name: 'Jim Varney' }
    ],
    plot: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    language: 'English',
    country: 'USA',
    awards: 'Nominated for 3 Oscars. Another 27 wins & 20 nominations.',
    reviews: [
      {
        id: 1,
        username: 'Jack',
        comment: 'Toy Story is the film that started Pixar Animated Studios into its long string of never ending success. What Pixar does is not just absorb the younger demographic and keep the older ones mildly entertained.',
        rating: 5
      },
      {
        id: 0,
        username: 'Tom',
        comment: 'Toy Story is the film that started Pixar Animated Studios into its long string of never ending success. What Pixar does is not just absorb the younger demographic and keep the older ones mildly entertained.',
        rating: 9
      }
    ],
    averageRating: 0
}];


// function that calculate avarage rating for a movie
function averageRating(movie){
  let foundMovie = movieObjects.find(function(elem){
  return elem.title === movie.title;
  });
  let reviewList = foundMovie.reviews;
  let sum = 0;
  let count = 0;
  reviewList.forEach(element => {
      sum += element.rating;
      count++;
  });
  let average = sum/count;
  foundMovie.averageRating = average;
  console.log("Calculate rating average of movie: ", movie.title);
  console.log("The average is: ", average);
  console.log(movieObjects);

}

// function that handle the search movie 
// the function is attached and test directly in the server
function searchForMovie(req, res){
	let body = req.body;
	let listOfMovies = [];

	movies.forEach(movie =>{
		let movieGenreLowerCase = movie.Genre.toLowerCase(); 
		let genreOfMovie = movieGenreLowerCase.split(", ");
		if (movie.Title.toLowerCase() == body.searchMovie.toLowerCase()){
			console.log("Found " + movie.Title);
			listOfMovies.push(movie)
			res.render("pages/search.pug", {movie: listOfMovies});
			return;
		}else if (genreOfMovie.includes(body.searchMovie.toLowerCase())){
			console.log("Found " + movie.Title);
			listOfMovies.push(movie);
		}else if (movie.Year == body.searchMovie){
			console.log("Found" + movie.Title);
			listOfMovies.push(movie);
		}
	})
	res.render("pages/search.pug", {movie: listOfMovies});
	return;
}

// test avarageRating function
let movie = {id: 0, title: "Toy Story"}
averageRating(movie)