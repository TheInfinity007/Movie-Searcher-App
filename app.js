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

app.get("/results", (req, res)=>{
	let query = req.query;
	let url = "http://www.omdbapi.com/?s=" + query.search + "&apikey=thewdb";
	request(url, (error, response, body)=>{
		if(!error && response.statusCode == 200){
			var data = JSON.parse(body);
			console.log(response.statusCode);
			console.log(data);
			if(data.Response == "True"){
				res.render("results", {data : data});
			}else{
				res.send(data);
			}
		}
	});
})

app.listen(3000, ()=>{
	console.log("Movie App has started!!");
	console.log("Server is listening at 'localhost:3000'");
});