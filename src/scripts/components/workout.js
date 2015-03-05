/** @jsx React.DOM */

var api = require("../helpers/api");

var Workout = React.createClass({
	getInitialState: function(){
		return { exercises: false };
	},
	componentDidMount: function(){
		var that = this;
		api.get("/exercises", function(exercises){
			that.setState({
				exercises: exercises
			});
		});
	},
	addExercise: function(){
		if(!this.state.selectedExercise) return;
		var exercise = this.state.exercises[this.state.selectedExercise.name];
		if(exercise.preQuantities){
			var unit = "";
			if(exercise.preQuantities[0].unit) unit = "(" + exercise.preQuantities[0].unit + ")";
			exercise.preQuantities[0].value = prompt(exercise.preQuantities[0].name + "? " + unit);
		}
		var numberOfSets = prompt("Nubmer of sets?");
		var selectedExerciseList = [];
		for(var i = 0; i < numberOfSets; i++){
			selectedExerciseList.push(exercise);
		}
		if(this.state.selectedExerciseList)
			selectedExerciseList = this.state.selectedExerciseList.concat(selectedExerciseList);
		this.setState({
			exercises: this.state.exercises,
			selectedExercise: this.state.selectedExercise,
			selectedExerciseList: selectedExerciseList
		});
	},
	changeExercise: function(event){
		this.setState({
			exercises: this.state.exercises,
			selectedExercise: this.state.exercises[event.target.value]
		});
	},
	render: function(){
		if(this.state.exercises){
			var exerciseOptions = [];
			_.each(this.state.exercises, function(exercise){
				var option = (
					<option value={exercise.name}>{exercise.name}</option>
				);
				exerciseOptions.push(option);
			});
			var selectedExercise = null;
			if(this.state.selectedExercise){
				selectedExercise = (
					<div>{this.state.selectedExercise.name}</div>
				);
			}
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
					{selectedExercise}
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