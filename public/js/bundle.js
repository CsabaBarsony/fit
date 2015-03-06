(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */

var Router = window.ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Home = require("./components/home");
var Exercises = require("./components/exercises");
var Workout= require("./components/workout");
var NotFound = require("./components/not_found");
var auth = require("./helpers/auth");

var App = React.createClass({displayName: "App",
	getInitialState: function(){
		return { auth: "authorizing" };
	},
	componentDidMount: function(){
		var that = this;
		auth.authorize(function(result){
			if(result) that.setState({ auth: "authorized" });
			else window.location.href = auth.loginPage;
		});
	},
	logout: function(){
		this.setState({ auth: "loggingOut" });
		auth.logout(function(){
			window.location.href = auth.loginPage;
		});
	},
	render: function () {
		if(this.state.auth === "authorizing") return React.createElement("h1", null, "Authorizing...");
		else if(this.state.auth === "loggingOut") return React.createElement("h1", null, "Logging out...")
		else if(this.state.auth === "authorized"){
			return (
				React.createElement("div", null, 
					React.createElement("header", null, 
						React.createElement("ul", null, 
							React.createElement("li", null, React.createElement(Link, {to: "home"}, "Home")), 
							React.createElement("li", null, React.createElement(Link, {to: "exercises"}, "Exercises")), 
							React.createElement("li", null, React.createElement(Link, {to: "workout"}, "New Workout")), 
							React.createElement("li", null, 
								React.createElement("a", {href: "#", onClick: this.logout}, "Logout")
							)
						), 
						React.createElement("div", null, 
							React.createElement("p", null, "user: ", auth.getUsername())
						)
					), 
					React.createElement(RouteHandler, null)
				)
			);
		}
	}
});

var routes = (
	React.createElement(Route, {name: "home", path: "/", handler: App}, 
		React.createElement(Route, {name: "exercises", handler: Exercises}), 
		React.createElement(Route, {name: "workout", handler: Workout}), 
		React.createElement(DefaultRoute, {handler: Home}), 
		React.createElement(NotFoundRoute, {handler: NotFound})
	)
);

Router.run(routes, function(Handler) {
	React.render(React.createElement(Handler, null), document.body);
});


},{"./components/exercises":2,"./components/home":3,"./components/not_found":4,"./components/workout":5,"./helpers/auth":7}],2:[function(require,module,exports){
/** @jsx React.DOM */

var api = require("../helpers/api");

var Exercises = React.createClass({displayName: "Exercises",
	getInitialState: function(){
		return {
			state: "loading_exercises",
			exercises: []
		}
	},
	componentDidMount: function(){
		api.get("/exercises", function(exercises){
			console.log(exercises);
		});
	},
	render: function(){
		return (
			React.createElement("h2", null, "Exercises")
		);
	}
});

module.exports = Exercises;

},{"../helpers/api":6}],3:[function(require,module,exports){
/** @jsx React.DOM */

var api = require("../helpers/api");

var Home = React.createClass({displayName: "Home",
	testGet: function(){
		api.get("/secret", function(result){
			console.log("get working", result);
		});
	},
	testPost: function(){
		api.post("/secret", { testData: "majom" }, function(result){
			console.log("post working", result);
		})
	},
	render: function(){
		return (
			React.createElement("div", null, 
				React.createElement("h2", null, "Home"), 
				React.createElement("button", {type: "text", onClick: this.testGet}, "Get"), 
				React.createElement("button", {type: "text", onClick: this.testPost}, "Post")
			)
		);
	}
});

module.exports = Home;


},{"../helpers/api":6}],4:[function(require,module,exports){
/** @jsx React.DOM */

var NotFound = React.createClass({displayName: "NotFound",
	render: function(){
		return (
			React.createElement("div", null, "Page is not found")
		);
	}
});

module.exports = NotFound;

},{}],5:[function(require,module,exports){
/** @jsx React.DOM */

var api = require("../helpers/api");

var Workout = React.createClass({displayName: "Workout",
	getInitialState: function(){
		return {
			exercises: null,
			selectedExercise: null,
			exercisesForWorkout: []
		};
	},
	componentDidMount: function(){
		var that = this;
		api.get("/exercises", function(exercises){
			that.setState({
				exercises: exercises,
				selectedExercise: exercises[0]
			});
		});
	},
	addExercise: function(){
		var weight = prompt("Weight? (kg)");
		var sets = prompt("Number of sets?");
		var selectedExerciseList = [];
		for(var i = 0; i < sets; i++){
			selectedExerciseList.push(this.state.selectedExercise);
		}
		var newState = React.addons.update(this.state, {
			exercisesForWorkout: {
				$push: selectedExerciseList
			}
		});
		this.setState(newState);
	},
	changeExercise: function(event){
		this.setState({
			exercises: this.state.exercises,
			selectedExercise: event.target.value
		});
	},
	render: function(){
		if(this.state.exercises){
			var exerciseOptions = [];
			_.each(this.state.exercises, function(exercise){
				var option = (
					React.createElement("option", {value: exercise}, exercise)
				);
				exerciseOptions.push(option);
			});
			var selectedExerciseList = [];
			_.each(this.state.selectedExerciseList, function(exercise){
				var element;
				if(exercise.preQuantities){
					element = (
						React.createElement("p", null, exercise.name, " ", exercise.preQuantities[0].value, " ", exercise.preQuantities[0].unit)
					);
				}
				else{
					element = (
						React.createElement("p", null, exercise.name)
					);
				}
				selectedExerciseList.push(element);
			});
			return (
				React.createElement("div", null, 
					React.createElement("h2", null, "New Workout"), 
					React.createElement("div", null, this.state.selectedExercise), 
					React.createElement("select", {onChange: this.changeExercise}, 
						exerciseOptions
					), 
					React.createElement("button", {onClick: this.addExercise}, "Add exercise"), 
					selectedExerciseList
				)
			);
		}
		else{
			return (
				React.createElement("h2", null, "Loading...")
			);
		}
	}
});

module.exports = Workout;

},{"../helpers/api":6}],6:[function(require,module,exports){
var auth = require("./auth");

module.exports = {
	log: function(text){
		console.log(text);
	},
	get: function(url, success){
		$.ajax({
			url: url,
			type: 'GET',
			headers: {
				"x-auth-token": auth.getToken(),
				"x-auth-username": auth.getUsername()
			},
			success: function(result) {
				success(result);
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(status);
				if(xhr.status >= 400) window.location.href = auth.loginPage;
			}.bind(this)
		});
	},
	post: function(url, data, success){
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			headers: {
				"x-auth-token": auth.getToken(),
				"x-auth-username": auth.getUsername()
			},
			success: function(result) {
				success(result);
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(status);
				if(xhr.status >= 400) window.location.href = auth.loginPage;
			}.bind(this)
		});
	}
};

},{"./auth":7}],7:[function(require,module,exports){
var auth = {
	loginPage: "/login.html",
	logout: function(callback){
		$.ajax({
			url: "/logout",
			type: 'POST',
			data: {
				username: this.getUsername()
			},
			success: function(result) {
				delete localStorage.token;
				delete localStorage.username;
				callback();
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("error while loggint out");
				delete localStorage.token;
				delete localStorage.username;
				callback();
			}.bind(this)
		});
	},
	authorize: function(callback){
		if(!this.getToken()) {
			callback(false);
			return;
		}

		$.ajax({
			url: "/authorize",
			type: 'GET',
			headers: {
				"x-auth-token": this.getToken(),
				"x-auth-username": this.getUsername()
			},
			success: function(result) {
				callback(true);
			}.bind(this),
			error: function(xhr, status, err) {
				callback(false);
			}.bind(this)
		});
	},
	getToken: function(){
		return localStorage.token;
	},
	getUsername: function(){
		return localStorage.username;
	},
	loggedIn: function(){
		return this.getToken();
	},
	onChange: function(){}
};

module.exports = auth;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXGRldlxcd2ViXFxmaXRcXHNyY1xcc2NyaXB0c1xcbWFpbi5qcyIsIkM6XFxkZXZcXHdlYlxcZml0XFxzcmNcXHNjcmlwdHNcXGNvbXBvbmVudHNcXGV4ZXJjaXNlcy5qcyIsIkM6XFxkZXZcXHdlYlxcZml0XFxzcmNcXHNjcmlwdHNcXGNvbXBvbmVudHNcXGhvbWUuanMiLCJDOlxcZGV2XFx3ZWJcXGZpdFxcc3JjXFxzY3JpcHRzXFxjb21wb25lbnRzXFxub3RfZm91bmQuanMiLCJDOlxcZGV2XFx3ZWJcXGZpdFxcc3JjXFxzY3JpcHRzXFxjb21wb25lbnRzXFx3b3Jrb3V0LmpzIiwiQzpcXGRldlxcd2ViXFxmaXRcXHNyY1xcc2NyaXB0c1xcaGVscGVyc1xcYXBpLmpzIiwiQzpcXGRldlxcd2ViXFxmaXRcXHNyY1xcc2NyaXB0c1xcaGVscGVyc1xcYXV0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLHFCQUFxQjs7QUFFckIsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUNoQyxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDO0FBQ3ZDLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7QUFDekMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztBQUN2QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3pCLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDdkMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDeEMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDbEQsSUFBSSxPQUFPLEVBQUUsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENB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UixjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRTtJQUMvQixpQkFBaUIsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFO0lBQ3JDO0dBQ0QsT0FBTyxFQUFFLFNBQVMsTUFBTSxFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNmLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztHQUNaLEtBQUssRUFBRSxTQUFTLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ2pDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7R0FDWixDQUFDLENBQUM7RUFDSDtDQUNELFFBQVEsRUFBRSxVQUFVO0VBQ25CLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQztFQUMxQjtDQUNELFdBQVcsRUFBRSxVQUFVO0VBQ3RCLE9BQU8sWUFBWSxDQUFDLFFBQVEsQ0FBQztFQUM3QjtDQUNELFFBQVEsRUFBRSxVQUFVO0VBQ25CLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0VBQ3ZCO0NBQ0QsUUFBUSxFQUFFLFVBQVUsRUFBRTtBQUN2QixDQUFDLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xyXG5cclxudmFyIFJvdXRlciA9IHdpbmRvdy5SZWFjdFJvdXRlcjtcclxudmFyIERlZmF1bHRSb3V0ZSA9IFJvdXRlci5EZWZhdWx0Um91dGU7XHJcbnZhciBOb3RGb3VuZFJvdXRlID0gUm91dGVyLk5vdEZvdW5kUm91dGU7XHJcbnZhciBMaW5rID0gUm91dGVyLkxpbms7XHJcbnZhciBSb3V0ZSA9IFJvdXRlci5Sb3V0ZTtcclxudmFyIFJvdXRlSGFuZGxlciA9IFJvdXRlci5Sb3V0ZUhhbmRsZXI7XHJcbnZhciBIb21lID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9ob21lXCIpO1xyXG52YXIgRXhlcmNpc2VzID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9leGVyY2lzZXNcIik7XHJcbnZhciBXb3Jrb3V0PSByZXF1aXJlKFwiLi9jb21wb25lbnRzL3dvcmtvdXRcIik7XHJcbnZhciBOb3RGb3VuZCA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvbm90X2ZvdW5kXCIpO1xyXG52YXIgYXV0aCA9IHJlcXVpcmUoXCIuL2hlbHBlcnMvYXV0aFwiKTtcclxuXHJcbnZhciBBcHAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIHsgYXV0aDogXCJhdXRob3JpemluZ1wiIH07XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKXtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdGF1dGguYXV0aG9yaXplKGZ1bmN0aW9uKHJlc3VsdCl7XHJcblx0XHRcdGlmKHJlc3VsdCkgdGhhdC5zZXRTdGF0ZSh7IGF1dGg6IFwiYXV0aG9yaXplZFwiIH0pO1xyXG5cdFx0XHRlbHNlIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYXV0aC5sb2dpblBhZ2U7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGxvZ291dDogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMuc2V0U3RhdGUoeyBhdXRoOiBcImxvZ2dpbmdPdXRcIiB9KTtcclxuXHRcdGF1dGgubG9nb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYXV0aC5sb2dpblBhZ2U7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYodGhpcy5zdGF0ZS5hdXRoID09PSBcImF1dGhvcml6aW5nXCIpIHJldHVybiA8aDE+QXV0aG9yaXppbmcuLi48L2gxPjtcclxuXHRcdGVsc2UgaWYodGhpcy5zdGF0ZS5hdXRoID09PSBcImxvZ2dpbmdPdXRcIikgcmV0dXJuIDxoMT5Mb2dnaW5nIG91dC4uLjwvaDE+XHJcblx0XHRlbHNlIGlmKHRoaXMuc3RhdGUuYXV0aCA9PT0gXCJhdXRob3JpemVkXCIpe1xyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdDxkaXY+XHJcblx0XHRcdFx0XHQ8aGVhZGVyPlxyXG5cdFx0XHRcdFx0XHQ8dWw+XHJcblx0XHRcdFx0XHRcdFx0PGxpPjxMaW5rIHRvPVwiaG9tZVwiPkhvbWU8L0xpbms+PC9saT5cclxuXHRcdFx0XHRcdFx0XHQ8bGk+PExpbmsgdG89XCJleGVyY2lzZXNcIj5FeGVyY2lzZXM8L0xpbms+PC9saT5cclxuXHRcdFx0XHRcdFx0XHQ8bGk+PExpbmsgdG89XCJ3b3Jrb3V0XCI+TmV3IFdvcmtvdXQ8L0xpbms+PC9saT5cclxuXHRcdFx0XHRcdFx0XHQ8bGk+XHJcblx0XHRcdFx0XHRcdFx0XHQ8YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMubG9nb3V0fT5Mb2dvdXQ8L2E+XHJcblx0XHRcdFx0XHRcdFx0PC9saT5cclxuXHRcdFx0XHRcdFx0PC91bD5cclxuXHRcdFx0XHRcdFx0PGRpdj5cclxuXHRcdFx0XHRcdFx0XHQ8cD51c2VyOiB7YXV0aC5nZXRVc2VybmFtZSgpfTwvcD5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2hlYWRlcj5cclxuXHRcdFx0XHRcdDxSb3V0ZUhhbmRsZXIvPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcblxyXG52YXIgcm91dGVzID0gKFxyXG5cdDxSb3V0ZSBuYW1lPVwiaG9tZVwiIHBhdGg9XCIvXCIgaGFuZGxlcj17QXBwfT5cclxuXHRcdDxSb3V0ZSBuYW1lPVwiZXhlcmNpc2VzXCIgaGFuZGxlcj17RXhlcmNpc2VzfS8+XHJcblx0XHQ8Um91dGUgbmFtZT1cIndvcmtvdXRcIiBoYW5kbGVyPXtXb3Jrb3V0fS8+XHJcblx0XHQ8RGVmYXVsdFJvdXRlIGhhbmRsZXI9e0hvbWV9Lz5cclxuXHRcdDxOb3RGb3VuZFJvdXRlIGhhbmRsZXI9e05vdEZvdW5kfS8+XHJcblx0PC9Sb3V0ZT5cclxuKTtcclxuXHJcblJvdXRlci5ydW4ocm91dGVzLCBmdW5jdGlvbihIYW5kbGVyKSB7XHJcblx0UmVhY3QucmVuZGVyKDxIYW5kbGVyLz4sIGRvY3VtZW50LmJvZHkpO1xyXG59KTtcclxuIiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXHJcblxyXG52YXIgYXBpID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvYXBpXCIpO1xyXG5cclxudmFyIEV4ZXJjaXNlcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRzdGF0ZTogXCJsb2FkaW5nX2V4ZXJjaXNlc1wiLFxyXG5cdFx0XHRleGVyY2lzZXM6IFtdXHJcblx0XHR9XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKXtcclxuXHRcdGFwaS5nZXQoXCIvZXhlcmNpc2VzXCIsIGZ1bmN0aW9uKGV4ZXJjaXNlcyl7XHJcblx0XHRcdGNvbnNvbGUubG9nKGV4ZXJjaXNlcyk7XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxoMj5FeGVyY2lzZXM8L2gyPlxyXG5cdFx0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFeGVyY2lzZXM7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXHJcblxyXG52YXIgYXBpID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvYXBpXCIpO1xyXG5cclxudmFyIEhvbWUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0dGVzdEdldDogZnVuY3Rpb24oKXtcclxuXHRcdGFwaS5nZXQoXCIvc2VjcmV0XCIsIGZ1bmN0aW9uKHJlc3VsdCl7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiZ2V0IHdvcmtpbmdcIiwgcmVzdWx0KTtcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0dGVzdFBvc3Q6IGZ1bmN0aW9uKCl7XHJcblx0XHRhcGkucG9zdChcIi9zZWNyZXRcIiwgeyB0ZXN0RGF0YTogXCJtYWpvbVwiIH0sIGZ1bmN0aW9uKHJlc3VsdCl7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwicG9zdCB3b3JraW5nXCIsIHJlc3VsdCk7XHJcblx0XHR9KVxyXG5cdH0sXHJcblx0cmVuZGVyOiBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0XHQ8aDI+SG9tZTwvaDI+XHJcblx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwidGV4dFwiIG9uQ2xpY2s9e3RoaXMudGVzdEdldH0+R2V0PC9idXR0b24+XHJcblx0XHRcdFx0PGJ1dHRvbiB0eXBlPVwidGV4dFwiIG9uQ2xpY2s9e3RoaXMudGVzdFBvc3R9PlBvc3Q8L2J1dHRvbj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWU7XHJcbiIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xyXG5cclxudmFyIE5vdEZvdW5kID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlcjogZnVuY3Rpb24oKXtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxkaXY+UGFnZSBpcyBub3QgZm91bmQ8L2Rpdj5cclxuXHRcdCk7XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTm90Rm91bmQ7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXHJcblxyXG52YXIgYXBpID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvYXBpXCIpO1xyXG5cclxudmFyIFdvcmtvdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZXhlcmNpc2VzOiBudWxsLFxyXG5cdFx0XHRzZWxlY3RlZEV4ZXJjaXNlOiBudWxsLFxyXG5cdFx0XHRleGVyY2lzZXNGb3JXb3Jrb3V0OiBbXVxyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0YXBpLmdldChcIi9leGVyY2lzZXNcIiwgZnVuY3Rpb24oZXhlcmNpc2VzKXtcclxuXHRcdFx0dGhhdC5zZXRTdGF0ZSh7XHJcblx0XHRcdFx0ZXhlcmNpc2VzOiBleGVyY2lzZXMsXHJcblx0XHRcdFx0c2VsZWN0ZWRFeGVyY2lzZTogZXhlcmNpc2VzWzBdXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRhZGRFeGVyY2lzZTogZnVuY3Rpb24oKXtcclxuXHRcdHZhciB3ZWlnaHQgPSBwcm9tcHQoXCJXZWlnaHQ/IChrZylcIik7XHJcblx0XHR2YXIgc2V0cyA9IHByb21wdChcIk51bWJlciBvZiBzZXRzP1wiKTtcclxuXHRcdHZhciBzZWxlY3RlZEV4ZXJjaXNlTGlzdCA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHNldHM7IGkrKyl7XHJcblx0XHRcdHNlbGVjdGVkRXhlcmNpc2VMaXN0LnB1c2godGhpcy5zdGF0ZS5zZWxlY3RlZEV4ZXJjaXNlKTtcclxuXHRcdH1cclxuXHRcdHZhciBuZXdTdGF0ZSA9IFJlYWN0LmFkZG9ucy51cGRhdGUodGhpcy5zdGF0ZSwge1xyXG5cdFx0XHRleGVyY2lzZXNGb3JXb3Jrb3V0OiB7XHJcblx0XHRcdFx0JHB1c2g6IHNlbGVjdGVkRXhlcmNpc2VMaXN0XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XHJcblx0fSxcclxuXHRjaGFuZ2VFeGVyY2lzZTogZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7XHJcblx0XHRcdGV4ZXJjaXNlczogdGhpcy5zdGF0ZS5leGVyY2lzZXMsXHJcblx0XHRcdHNlbGVjdGVkRXhlcmNpc2U6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRyZW5kZXI6IGZ1bmN0aW9uKCl7XHJcblx0XHRpZih0aGlzLnN0YXRlLmV4ZXJjaXNlcyl7XHJcblx0XHRcdHZhciBleGVyY2lzZU9wdGlvbnMgPSBbXTtcclxuXHRcdFx0Xy5lYWNoKHRoaXMuc3RhdGUuZXhlcmNpc2VzLCBmdW5jdGlvbihleGVyY2lzZSl7XHJcblx0XHRcdFx0dmFyIG9wdGlvbiA9IChcclxuXHRcdFx0XHRcdDxvcHRpb24gdmFsdWU9e2V4ZXJjaXNlfT57ZXhlcmNpc2V9PC9vcHRpb24+XHJcblx0XHRcdFx0KTtcclxuXHRcdFx0XHRleGVyY2lzZU9wdGlvbnMucHVzaChvcHRpb24pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dmFyIHNlbGVjdGVkRXhlcmNpc2VMaXN0ID0gW107XHJcblx0XHRcdF8uZWFjaCh0aGlzLnN0YXRlLnNlbGVjdGVkRXhlcmNpc2VMaXN0LCBmdW5jdGlvbihleGVyY2lzZSl7XHJcblx0XHRcdFx0dmFyIGVsZW1lbnQ7XHJcblx0XHRcdFx0aWYoZXhlcmNpc2UucHJlUXVhbnRpdGllcyl7XHJcblx0XHRcdFx0XHRlbGVtZW50ID0gKFxyXG5cdFx0XHRcdFx0XHQ8cD57ZXhlcmNpc2UubmFtZX0ge2V4ZXJjaXNlLnByZVF1YW50aXRpZXNbMF0udmFsdWV9IHtleGVyY2lzZS5wcmVRdWFudGl0aWVzWzBdLnVuaXR9PC9wPlxyXG5cdFx0XHRcdFx0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZXtcclxuXHRcdFx0XHRcdGVsZW1lbnQgPSAoXHJcblx0XHRcdFx0XHRcdDxwPntleGVyY2lzZS5uYW1lfTwvcD5cclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNlbGVjdGVkRXhlcmNpc2VMaXN0LnB1c2goZWxlbWVudCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdDxkaXY+XHJcblx0XHRcdFx0XHQ8aDI+TmV3IFdvcmtvdXQ8L2gyPlxyXG5cdFx0XHRcdFx0PGRpdj57dGhpcy5zdGF0ZS5zZWxlY3RlZEV4ZXJjaXNlfTwvZGl2PlxyXG5cdFx0XHRcdFx0PHNlbGVjdCBvbkNoYW5nZT17dGhpcy5jaGFuZ2VFeGVyY2lzZX0+XHJcblx0XHRcdFx0XHRcdHtleGVyY2lzZU9wdGlvbnN9XHJcblx0XHRcdFx0XHQ8L3NlbGVjdD5cclxuXHRcdFx0XHRcdDxidXR0b24gb25DbGljaz17dGhpcy5hZGRFeGVyY2lzZX0+QWRkIGV4ZXJjaXNlPC9idXR0b24+XHJcblx0XHRcdFx0XHR7c2VsZWN0ZWRFeGVyY2lzZUxpc3R9XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdDxoMj5Mb2FkaW5nLi4uPC9oMj5cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXb3Jrb3V0OyIsInZhciBhdXRoID0gcmVxdWlyZShcIi4vYXV0aFwiKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cdGxvZzogZnVuY3Rpb24odGV4dCl7XHJcblx0XHRjb25zb2xlLmxvZyh0ZXh0KTtcclxuXHR9LFxyXG5cdGdldDogZnVuY3Rpb24odXJsLCBzdWNjZXNzKXtcclxuXHRcdCQuYWpheCh7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHR0eXBlOiAnR0VUJyxcclxuXHRcdFx0aGVhZGVyczoge1xyXG5cdFx0XHRcdFwieC1hdXRoLXRva2VuXCI6IGF1dGguZ2V0VG9rZW4oKSxcclxuXHRcdFx0XHRcIngtYXV0aC11c2VybmFtZVwiOiBhdXRoLmdldFVzZXJuYW1lKClcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24ocmVzdWx0KSB7XHJcblx0XHRcdFx0c3VjY2VzcyhyZXN1bHQpO1xyXG5cdFx0XHR9LmJpbmQodGhpcyksXHJcblx0XHRcdGVycm9yOiBmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coc3RhdHVzKTtcclxuXHRcdFx0XHRpZih4aHIuc3RhdHVzID49IDQwMCkgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBhdXRoLmxvZ2luUGFnZTtcclxuXHRcdFx0fS5iaW5kKHRoaXMpXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHBvc3Q6IGZ1bmN0aW9uKHVybCwgZGF0YSwgc3VjY2Vzcyl7XHJcblx0XHQkLmFqYXgoe1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0dHlwZTogJ1BPU1QnLFxyXG5cdFx0XHRkYXRhOiBkYXRhLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XCJ4LWF1dGgtdG9rZW5cIjogYXV0aC5nZXRUb2tlbigpLFxyXG5cdFx0XHRcdFwieC1hdXRoLXVzZXJuYW1lXCI6IGF1dGguZ2V0VXNlcm5hbWUoKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuXHRcdFx0XHRzdWNjZXNzKHJlc3VsdCk7XHJcblx0XHRcdH0uYmluZCh0aGlzKSxcclxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhzdGF0dXMpO1xyXG5cdFx0XHRcdGlmKHhoci5zdGF0dXMgPj0gNDAwKSB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGF1dGgubG9naW5QYWdlO1xyXG5cdFx0XHR9LmJpbmQodGhpcylcclxuXHRcdH0pO1xyXG5cdH1cclxufTsiLCJ2YXIgYXV0aCA9IHtcclxuXHRsb2dpblBhZ2U6IFwiL2xvZ2luLmh0bWxcIixcclxuXHRsb2dvdXQ6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuXHRcdCQuYWpheCh7XHJcblx0XHRcdHVybDogXCIvbG9nb3V0XCIsXHJcblx0XHRcdHR5cGU6ICdQT1NUJyxcclxuXHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdHVzZXJuYW1lOiB0aGlzLmdldFVzZXJuYW1lKClcclxuXHRcdFx0fSxcclxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24ocmVzdWx0KSB7XHJcblx0XHRcdFx0ZGVsZXRlIGxvY2FsU3RvcmFnZS50b2tlbjtcclxuXHRcdFx0XHRkZWxldGUgbG9jYWxTdG9yYWdlLnVzZXJuYW1lO1xyXG5cdFx0XHRcdGNhbGxiYWNrKCk7XHJcblx0XHRcdH0uYmluZCh0aGlzKSxcclxuXHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKHhociwgc3RhdHVzLCBlcnIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcImVycm9yIHdoaWxlIGxvZ2dpbnQgb3V0XCIpO1xyXG5cdFx0XHRcdGRlbGV0ZSBsb2NhbFN0b3JhZ2UudG9rZW47XHJcblx0XHRcdFx0ZGVsZXRlIGxvY2FsU3RvcmFnZS51c2VybmFtZTtcclxuXHRcdFx0XHRjYWxsYmFjaygpO1xyXG5cdFx0XHR9LmJpbmQodGhpcylcclxuXHRcdH0pO1xyXG5cdH0sXHJcblx0YXV0aG9yaXplOiBmdW5jdGlvbihjYWxsYmFjayl7XHJcblx0XHRpZighdGhpcy5nZXRUb2tlbigpKSB7XHJcblx0XHRcdGNhbGxiYWNrKGZhbHNlKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdCQuYWpheCh7XHJcblx0XHRcdHVybDogXCIvYXV0aG9yaXplXCIsXHJcblx0XHRcdHR5cGU6ICdHRVQnLFxyXG5cdFx0XHRoZWFkZXJzOiB7XHJcblx0XHRcdFx0XCJ4LWF1dGgtdG9rZW5cIjogdGhpcy5nZXRUb2tlbigpLFxyXG5cdFx0XHRcdFwieC1hdXRoLXVzZXJuYW1lXCI6IHRoaXMuZ2V0VXNlcm5hbWUoKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdWNjZXNzOiBmdW5jdGlvbihyZXN1bHQpIHtcclxuXHRcdFx0XHRjYWxsYmFjayh0cnVlKTtcclxuXHRcdFx0fS5iaW5kKHRoaXMpLFxyXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oeGhyLCBzdGF0dXMsIGVycikge1xyXG5cdFx0XHRcdGNhbGxiYWNrKGZhbHNlKTtcclxuXHRcdFx0fS5iaW5kKHRoaXMpXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdGdldFRva2VuOiBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIGxvY2FsU3RvcmFnZS50b2tlbjtcclxuXHR9LFxyXG5cdGdldFVzZXJuYW1lOiBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIGxvY2FsU3RvcmFnZS51c2VybmFtZTtcclxuXHR9LFxyXG5cdGxvZ2dlZEluOiBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIHRoaXMuZ2V0VG9rZW4oKTtcclxuXHR9LFxyXG5cdG9uQ2hhbmdlOiBmdW5jdGlvbigpe31cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYXV0aDsiXX0=
