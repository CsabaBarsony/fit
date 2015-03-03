/** @jsx React.DOM */

var React = require("react");
var cs = require("../helpers/cs");

var Exercises = React.createClass({
	getInitialState: function(){
		return {
			state: "loading_exercises",
			exercises: []
		}
	},
	componentDidMount: function(){
		cs.get("/exercises", function(exercises){
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