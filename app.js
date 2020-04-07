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

		// console.log(query);
		let url;
		if(searchQueryType === "i" || searchQueryType === "t"){
			url = "http://www.omdbapi.com/?" + req._parsedUrl.query + "&plot=full&apikey=" + process.env.OMDB_API_KEY;
		}else{
			var search = searchQueryType + "=" + searchQuery + "&y=" + yearQuery;
			url = "http://www.omdbapi.com/?" + search + "&page=" + pageNo + "&apikey=" + process.env.OMDB_API_KEY;
		}
		// console.log(url);
		let msg = "";
		request(url, (error, response, body)=>{
			if(!error && response.statusCode == 200){
				var data = JSON.parse(body);
				// console.log(response.statusCode);
				if((query.t || query.i) && data.Response == "True"){
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
				// msg = "Error Occured! Please Try again";
				res.redirect("back");
			}
		});
	}else{
		res.redirect("/");
	}
});


//show route
app.get("/search/:imdbID", (req, res)=>{
	let url = "http://www.omdbapi.com/?i=" + req.params.imdbID + "&plot=full&apikey=" + process.env.OMDB_API_KEY;
	// console.log(url);
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			// console.log(response.statusCode);
			if(data.Response == "True"){
				res.render("show", {data: data});
				// res.render("show", {data: seedData});
			}else{
				// console.log(data);
				let msg = "";
				if(data.Error == "Too many results."){
					msg = data.Error + " Please type a meaningful word.";
					return res.render("search", {msg : msg});
				}
				res.redirect("back");				
			}
		}else{
			// let msg = data.Error + "Please try again";
			res.redirect("back");
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

