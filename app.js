require("dotenv").config();

const 	express 	= require("express"),
		ejs				= require("ejs"),
		bodyParser	= require("body-parser"),
		path 				= require("path"),
		request			= require("request");
		app				= express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
	res.render("search");
});

//index route
app.get("/search", (req, res)=>{
	let query = req.query;
	console.log(req._parsedUrl.query);
	console.log(query);
	let url = "http://www.omdbapi.com/?" + req._parsedUrl.query + "&plot=full&apikey=" + process.env.OMDB_API_KEY;
	console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			var data = JSON.parse(body);
			console.log(response.statusCode);
			console.log(data);
			if(query.t || query.i){
				res.render("show", {data : data});
			}
			else if(data.Response == "True"){
				console.log(data);
				res.render("results", {data : data });
			}else{
				res.send(data);
			}
		}else{
			res.send("Error Occured! Please Try again");
		}
	});
	// res.render("results", { data: seedData2, title: false });
});

var seedData = {
  Title: 'Jumanji: Welcome to the Jungle',
  Year: '2017',
  Rated: 'PG-13',
  Released: '20 Dec 2017',
  Runtime: '119 min',
  Genre: 'Action, Adventure, Comedy, Fantasy',
  Director: 'Jake Kasdan',
  Writer: 'Chris McKenna (screenplay by), Erik Sommers (screenplay by), Scott Rosenberg (screenplay by), Jeff Pinkner (screenplay by), Chris McKenna (screen story by), Chris Van Allsburg (based on the book "Jumanji" by), Greg Taylor (based on the film "Jumanji" screen story by), Chris Van Allsburg (based on the film "Jumanji" screen story by), Jonathan Hensleigh (based on the film "Jumanji" screenplay by), Greg Taylor (based on the film "Jumanji" screenplay by), Jim Strain (based on the film "Jumanji" by)',
  Actors: 'Dwayne Johnson, Kevin Hart, Jack Black, Karen Gillan',
  Plot: "In a brand new Jumanji adventure, four high school kids discover an old video game console and are drawn into the game's jungle setting, literally becoming the adult avatars they chose. What they discover is that you don't just play Jumanji - you must survive it. To beat the game and return to the real world, they'll have to go on the most dangerous adventure of their lives, discover what Alan Parrish left 20 years ago, and change the way they think about themselves - or they'll be stuck in the game forever, to be played by others without break.",
  Language: 'English',
  Country: 'USA, India, Canada, UK, Australia, Germany',
  Awards: '5 wins & 14 nominations.',
  Poster: 'https://m.media-amazon.com/images/M/MV5BODQ0NDhjYWItYTMxZi00NTk2LWIzNDEtOWZiYWYxZjc2MTgxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
  Ratings: [
    { Source: 'Internet Movie Database', Value: '6.9/10' },
    { Source: 'Rotten Tomatoes', Value: '76%' },
    { Source: 'Metacritic', Value: '58/100' }
  ],
  Metascore: '58',
  imdbRating: '6.9',
  imdbVotes: '289,618',
  imdbID: 'tt2283362',
  Type: 'movie',
  DVD: '20 Mar 2018',
  BoxOffice: '$393,201,353',
  Production: 'Columbia Pictures',
  Website: 'N/A',
  Response: 'True'
};

//show route
app.get("/search/:imdbID", (req, res)=>{
	console.log("IMDB route");
		let url = "http://www.omdbapi.com/?i=" + req.params.imdbID + "&plot=full&apikey=" + process.env.OMDB_API_KEY;
		console.log(url);
		request(url, (error, response, body)=>{
			if(!error && response.statusCode == 200){
				let data = JSON.parse(body);
				console.log(response.statusCode);
				console.log(data);
				if(data.Response == "True"){
					res.render("show", {data: data});
					res.render("show", {data: seedData});
				}else{
					res.send(data);
				}
			}else{
				res.send("Error Occured! Please Try again");
			}
		});
		// res.render("show", {data: seedData});
});

app.listen(3000, ()=>{
	console.log("Movie App has started!!");
	console.log("Server is listening at 'localhost:3000'");
});


var seedData2 = {
	Search: [
	    {
	      Title: 'Jumanji: Welcome to the Jungle',
	      Year: '2017',
	      imdbID: 'tt2283362',
	      Type: 'movie',
	      Poster: 'https://m.media-amazon.com/images/M/MV5BODQ0NDhjYWItYTMxZi00NTk2LWIzNDEtOWZiYWYxZjc2MTgxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'
	    },
	    {
	      Title: 'Jumanji',
	      Year: '1995',
	      imdbID: 'tt0113497',
	      Type: 'movie',
	      Poster: 'https://m.media-amazon.com/images/M/MV5BZTk2ZmUwYmEtNTcwZS00YmMyLWFkYjMtNTRmZDA3YWExMjc2XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'
	    },
	    {
	      Title: 'Jumanji: The Next Level',
	      Year: '2019',
	      imdbID: 'tt7975244',
	      Type: 'movie',
	      Poster: 'https://m.media-amazon.com/images/M/MV5BOTVjMmFiMDUtOWQ4My00YzhmLWE3MzEtODM1NDFjMWEwZTRkXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg'
	    },
	    {
	      Title: 'Jumanji',
	      Year: '1996–1999',
	      imdbID: 'tt0115228',
	      Type: 'series',
	      Poster: 'https://m.media-amazon.com/images/M/MV5BMTIwMzQyOTI0Nl5BMl5BanBnXkFtZTcwNzQ0OTIyMQ@@._V1_SX300.jpg'
	    },
	    {
	      Title: "Lions and Monkeys and Pods... Oh My!: The Special Effects of 'Jumanji'",
	      Year: '1999',
	      imdbID: 'tt0311446',
	      Type: 'movie',
	      Poster: 'N/A'
	    },
	    {
	      Title: 'IMDb LIVE at the Jumanji: The Next Level Premiere',
	      Year: '2019–',
	      imdbID: 'tt11341910',
	      Type: 'series',
	      Poster: 'https://m.media-amazon.com/images/M/MV5BMzMzMmQzNGItMjZjMy00NjkwLWI0NzMtODcwZWJiODY0NTI5XkEyXkFqcGdeQXVyNzU1ODY5NTg@._V1_SX300.jpg'
	    },
	    {
	      Title: 'Jumanji',
	      Year: '1997',
	      imdbID: 'tt5586628',
	      Type: 'game',
	      Poster: 'N/A'
	    },
	    {
	      Title: 'Making Jumanji: The Realm of Imagination',
	      Year: '2000',
	      imdbID: 'tt5299620',
	      Type: 'movie',
	      Poster: 'N/A'
	    },
	    {
	      Title: "The Cast of Goosebumps Reflects on 'Jumanji'",
	      Year: '2015',
	      imdbID: 'tt5299728',
	      Type: 'movie',
	      Poster: 'N/A'
	    },
	    {
	      Title: 'Like Jumanji',
	      Year: '2009',
	      imdbID: 'tt1563146',
	      Type: 'movie',
	      Poster: 'N/A'
	    }
	 ],
	 totalResults: '10',
	 Response: 'True'
}