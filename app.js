require("dotenv").config();

const 	express 	= require("express"),
		ejs				= require("ejs"),
		bodyParser	= require("body-parser"),
		path 				= require("path"),
		request			= require("request");
		app				= express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
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
	let url = "http://www.omdbapi.com/?" + req._parsedUrl.query + "&apikey=" + process.env.OMDB_API_KEY;
	console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			var data = JSON.parse(body);
			console.log(response.statusCode);
			console.log(data);
			let title=false;
			if(query.t || query.i){
				res.render("results", {data : data, title: true});
			}
			else if(data.Response == "True"){
				res.render("results", {data : data, title: title});
			}else{
				res.send(data);
			}
		}else{
			res.send("Error Occured! Please Try again");
		}
	});
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
  Plot: 'Four teenagers are sucked into a magical video game, and the only way they can escape is to work together to finish the game.',
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
		let url = "http://www.omdbapi.com/?i=" + req.params.imdbID + "&apikey=" + process.env.OMDB_API_KEY;
		console.log(url);
		// request(url, (error, response, body)=>{
		// 	if(!error && response.statusCode == 200){
		// 		let data = JSON.parse(body);
		// 		console.log(response.statusCode);
		// 		console.log(data);
		// 		if(data.Response == "True"){
		// 			res.render("show", {data: data});
		// 		}else{
		// 			res.send(data);
		// 		}
		// 	}else{
		// 		res.send("Error Occured! Please Try again");
		// 	}
		// });
		res.render("show", {data: seedData});
});

app.listen(3000, ()=>{
	console.log("Movie App has started!!");
	console.log("Server is listening at 'localhost:3000'");
});