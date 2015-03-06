/** @jsx React.DOM */

var api = require("../helpers/api");

var Workout = React.createClass({
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
		var weight = prompt("Weight? (kg)", 0);
		var sets = prompt("Number of sets?", 1);
		var selectedExerciseList = [];
		for(var i = 0; i < sets; i++){
			selectedExerciseList.push({
				name: this.state.selectedExercise,
				weight: weight,
				key: this.state.exercisesForWorkout.length
			});
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
	removeExerciseFromWorkout: function(){
		console.log("xxx");
	},
	render: function(){
		if(this.state.exercises){
			var exerciseOptions = [],
				exerciseKey = 0;
			_.each(this.state.exercises, function(exercise){
				var option = (
					<option key={Math.random()} value={exercise}>{exercise}</option>
				);
				exerciseOptions.push(option);
			});
			var exercisesForWorkout = [];
			_.each(this.state.exercisesForWorkout, function(exercise){
				var element;
				element = (
					<div key={exerciseKey++}>
						<span>{exercise.name} {exercise.weight} kg</span><button onClick={this.removeExerciseFromWorkout}>remove</button>
					</div>
				);
				exercisesForWorkout.push(element);
			});
			return (
				<div>
					<h2>New Workout</h2>
					<div>{this.state.selectedExercise}</div>
					<select onChange={this.changeExercise}>
						{exerciseOptions}
					</select>
					<button onClick={this.addExercise}>Add exercise</button>
					{exercisesForWorkout}
				</div>
			);
		}
		else{
			return (
				<h2>Loading...</h2>
			);
		}
	}
});

module.exports = Workout;