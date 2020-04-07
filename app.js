require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const bodyParser	= require("body-parser");
const request = require("request");
const app	= express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
	let msg="";
	res.render("search", { msg: msg });
});

//index route
app.get("/search", (req, res)=>{
	if(req.query.s || req.query.t || req.query.i){
		let query = req.query;
		let pageQuery = parseInt(req.query.page);
		let searchQuery = req.query.t || req.query.i || req.query.s;
		let searchQueryType = req.query.t?"t" :  (req.query.i ?"i" : "s");
		let yearQuery = req.query.y;

		var pageNo = pageQuery ? pageQuery : 1;
		console.log("PageNo = " + pageNo);

		console.log("Parsed Url = " + req._parsedUrl.query);
		console.log(query);
		let url;
		if(searchQueryType === "i" || searchQueryType === "t"){
			url = "http://www.omdbapi.com/?" + req._parsedUrl.query + "&plot=full&apikey=" + process.env.OMDB_API_KEY;
		}else{
			var search = searchQueryType + "=" + searchQuery + "&y=" + yearQuery;
			url = "http://www.omdbapi.com/?" + search + "&page=" + pageNo + "&apikey=" + process.env.OMDB_API_KEY;
		}
		console.log(url);
		let msg = "";
		request(url, (error, response, body)=>{
			if(!error && response.statusCode == 200){
				var data = JSON.parse(body);
				console.log(response.statusCode);
				if(query.t || query.i){
					res.render("show", {data : data});
				}else if(data.Response == "True"){
					res.render("results", {
						data : data,
						search : search,
						current: pageNo,
						pages: Math.ceil(data['totalResults']/10),
					});
				}else{
					console.log(data);
					if(data.Error == "Too many results."){
						msg = data.Error + " Please type a meaningful word.";
						return res.render("search", {msg : msg});
					}
					res.redirect("back");
				}
			}else{
				console.log(error);
				msg = "Error Occured! Please Try again";
				res.render("search", { msg: msg });
			}
		});
	}else{
		res.redirect("/");
	}
});



//show route
app.get("/search/:imdbID", (req, res)=>{
	console.log("IMDB route");
	let url = "http://www.omdbapi.com/?i=" + req.params.imdbID + "&plot=full&apikey=" + process.env.OMDB_API_KEY;
	console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			console.log(response.statusCode);
			if(data.Response == "True"){
				res.render("show", {data: data});
				res.render("show", {data: seedData});
			}else{
				console.log(data);
				let msg = "";
				if(data.Error == "Too many results."){
					msg = data.Error + " Please type a meaningful word.";
					return res.render("search", {msg : msg});
				}
				res.redirect("back");				
			}
		}else{
			let msg = "Please try again!";
			res.render("search");
		}
	});
});

app.get("/*", (req, res)=>{
	res.redirect("/");
});

app.listen(process.env.PORT || 3000, ()=>{
	console.log("Movie App has started!!");
	console.log("Server is listening at 'localhost:3000'");
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