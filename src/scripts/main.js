/** @jsx React.DOM */

var Router = window.ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Home = require("./components/home");
var Exercises = require("./components/exercises");
var Workouts = require("./components/workouts");
var SetWorkout= require("./components/set_workout");
var Workout = require("./components/workout");
var NotFound = require("./components/not_found");
var auth = require("./helpers/auth");

var App = React.createClass({
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
		if(this.state.auth === "authorizing") return <h1>Authorizing...</h1>;
		else if(this.state.auth === "loggingOut") return <h1>Logging out...</h1>
		else if(this.state.auth === "authorized"){
			return (
				<div>
					<header>
						<ul>
							<li><Link to="home">Home</Link></li>
							<li><Link to="exercises">Exercises</Link></li>
							<li><Link to="workouts">Workouts</Link></li>
							<li><Link to="set-workout">Set Workout</Link></li>
							<li>
								<a href="#" onClick={this.logout}>Logout</a>
							</li>
						</ul>
						<div>
							<p>user: {auth.getUsername()}</p>
						</div>
					</header>
					<RouteHandler/>
				</div>
			);
		}
	}
});

var routes = (
	<Route name="home" path="/" handler={App}>
		<Route name="exercises" handler={Exercises}/>
		<Route name="workouts" handler={Workouts}/>
		<Route name="set-workout" handler={SetWorkout}/>
		<Route name="workout" handler={Workout}/>
		<DefaultRoute handler={Home}/>
		<NotFoundRoute handler={NotFound}/>
	</Route>
);

Router.run(routes, function(Handler) {
	React.render(<Handler/>, document.body);
});
