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
					<option value={exercise}>{exercise}</option>
				);
				exerciseOptions.push(option);
			});
			var selectedExerciseList = [];
			_.each(this.state.selectedExerciseList, function(exercise){
				var element;
				if(exercise.preQuantities){
					element = (
						<p>{exercise.name} {exercise.preQuantities[0].value} {exercise.preQuantities[0].unit}</p>
					);
				}
				else{
					element = (
						<p>{exercise.name}</p>
					);
				}
				selectedExerciseList.push(element);
			});
			return (
				<div>
					<h2>New Workout</h2>
					<div>{this.state.selectedExercise}</div>
					<select onChange={this.changeExercise}>
						{exerciseOptions}
					</select>
					<button onClick={this.addExercise}>Add exercise</button>
					{selectedExerciseList}
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