/** @jsx React.DOM */

var React = require("react");
var api = require("../helpers/api");

var Exercises = React.createClass({
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
			<h2>Exercises</h2>
		);
	}
});

module.exports = Exercises;