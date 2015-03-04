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
			var preQuantity = prompt(exercise.preQuantities[0].name + "? " + unit);
			console.log(preQuantity);
		}
		var numberOfSets = prompt("Nubmer of sets?");
		console.log(numberOfSets);
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
			return (
				<div>
					<h2>New Workout</h2>
					{selectedExercise}
					<select onChange={this.changeExercise}>
						{exerciseOptions}
					</select>
					<button onClick={this.addExercise}>Add exercise</button>
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