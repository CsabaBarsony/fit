/** @jsx React.DOM */

var api = require("../helpers/api");
var Stopwatch = require("./stopwatch");

var Workout = React.createClass({
	getInitialState: function(){
		return {
			workout: JSON.parse(localStorage.getItem("workout")),
			exercise: 0,
			phase: "init"
		};
	},
	controlButtonClick: function(){
		if(this.state.phase === "init"){
			this.setState({
				workout: this.state.workout,
				exercise: this.state.exercise,
				phase: "exercise"
			});
		}
		else if(this.state.phase === "exercise"){
			if(this.state.workout.exercises.length - 1 > this.state.exercise){
				this.setState({
					workout: this.state.workout,
					exercise: this.state.exercise + 1,
					phase: "pause"
				});
			}
			else{
				this.setState({
					workout: this.state.workout,
					exercise: this.state.exercise,
					phase: "completed"
				});
			}
		}
		else if(this.state.phase === "pause"){
			this.setState({
				workout: this.state.workout,
				exercise: this.state.exercise,
				phase: "exercise"
			});
		}
		else if(this.state.phase === "completed"){
			if(this.state.workout.exercises.length !== this.tsList.length) throw new Error("baj van");
			var result = [];
			for(var i = 0, l = this.state.workout.exercises.length; i < l; i++){
				var exercise = this.state.workout.exercises[i];
				exercise.ts = this.tsList[i];
				result.push(exercise);
			}
			console.log(result);
			api.postWorkout(result, function(response){
				console.log("api post successful", response);
			});
		}
	},
	getStopwatchTs: function(ts){
		this.tsList.push(ts);
		console.log(this.tsList);
	},
	getControlButtonText: function(){
		var phase = this.state.phase;
		if(phase === "init") return "Begin Workout";
		else if(phase === "exercise") return "Ready";
		else if(phase === "pause") return "Start";
		else if(phase === "completed") return "Finish Workout";
	},
	tsList: [],
	render: function(){
		var actualExercise = (
			<strong>actual: {this.state.workout.exercises[this.state.exercise].name} {this.state.workout.exercises[this.state.exercise].weight}kg</strong>
		);
		var nextExercise;
		if(this.state.exercise !== this.state.workout.exercises.length - 1){
			nextExercise = (
				<strong>next: {this.state.workout.exercises[this.state.exercise + 1].name} {this.state.workout.exercises[this.state.exercise].weight}kg</strong>
			);
		}
		return (
			<div>
				<h2>Workout</h2>
				{actualExercise}<br />
				{nextExercise}<br />
				<button onClick={this.controlButtonClick}>{this.getControlButtonText()}</button>
				<Stopwatch phase={this.state.phase} getTs={this.getStopwatchTs}/>
			</div>
		);
	}
});

module.exports = Workout;