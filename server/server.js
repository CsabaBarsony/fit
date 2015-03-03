"use strict";

var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var portNumber = 3000;

var tokenLength = 40;
var headerToken = "x-auth-token";
var headerUsername = "x-auth-username";
var exercises = require("./exercises");
console.log(exercises);

var auth = {
	users: {
		a: {
			password: "a"
		}
	},
	register: function(username, password){
		if(this.users[username]){
			return {
				success: false,
				reason: "username already exists"
			};
		}
		if(!password){
			return {
				success: false,
				reason: "wrong password"
			};
		}
		var token = this.generateToken(tokenLength);
		this.users[username] = {
			password: password,
			token: token
		};
		return {
			success: true,
			token: token
		};
	},
	logIn: function(username, password){
		if(!this.users[username] || this.users[username].password !== password){
			return {
				success: false,
				reason: "wrong username or password"
			};
		}
		var token = this.generateToken(tokenLength);
		this.users[username].token = token;
		return {
			success: true,
			username: username,
			token: token
		};
	},
	logOut: function(username){
		if(this.users[username]){
			delete this.users[username].token;
		}
	},
	authorize: function(req, res, callback){
		var username = req.headers[headerUsername];
		var token = req.headers[headerToken];
		if(!this.users[username] || this.users[username].token !== token) res.sendStatus(401);
		else callback();
	},
	generateToken: function generateToken(length){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for(var i = 0; i < length; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}
};

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/register", function(req, res){
	res.send(auth.register(req.body.username, req.body.password));
});

app.post("/login", function(req, res){
	res.send(auth.logIn(req.body.username, req.body.password));
});

app.post("/logout", function(req, res){
	auth.logOut(req.body.username);
	res.redirect("/login.html");
});

// TODO: could be this pattern more compact?
app.get("/authorize", function(req, res){
	auth.authorize(req, res, function(){
		res.sendStatus(200);
	});
});

app.get("/secret", function(req, res){
	auth.authorize(req, res, function(){
		res.send("secret data from get");
	});
});

app.post("/secret", function(req, res){
	auth.authorize(req, res, function(){
		console.log(req.body);
		res.send("secret data from post");
	});
});

app.get("/exercises", function(req, res){
	auth.authorize(req, res, function(){
		res.send(exercises);
	})
});

app.use(express.static(path.join(__dirname, "../public")));

app.listen(portNumber);

console.log("Server is running on port " + portNumber + "...");