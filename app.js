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

app.listen(3000, ()=>{
	console.log("Movie App has started!!");
	console.log("Server is listening at 'localhost:3000'");
});