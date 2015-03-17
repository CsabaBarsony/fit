/** @jsx React.DOM */

var api = require("../helpers/api");

var Workouts = React.createClass({
	getInitialState: function(){
		return {
			state: "loading_workouts",
			exercises: []
		}
	},
	componentDidMount: function(){
		api.get("/workouts", function(workouts){
			console.log(workouts);
		});
	},
	render: function(){
		return (
			<h2>Workouts</h2>
		);
	}
});

module.exports = Workouts;