/** @jsx React.DOM */

var api = require("../helpers/api");
var ExerciseForWorkout = require("./exerciseForWorkout");
var Navigation = window.ReactRouter.Navigation;

var SetWorkout = React.createClass({
	mixins: [Navigation],
	getInitialState: function(){
		return {
			exercises: null,
			selectedExercise: null,
			exerciseForWorkoutList: []
		};
	},
	componentDidMount: function(){
		localStorage.setItem("workout", "");
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
				weight: weight
			});
		}
		var newState = React.addons.update(this.state, {
			exerciseForWorkoutList: {
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
	removeExerciseFromWorkout: function(key){
		console.log("key", key);
		var newState = React.addons.update(this.state, {
			exerciseForWorkoutList: {
				$splice: [[key, 1]]
			}
		});
		this.setState(newState);
	},
	workoutReady: function(){
		localStorage.setItem("workout", JSON.stringify({ exercises: this.state.exerciseForWorkoutList }));
		this.transitionTo("workout");
	},
	render: function(){
		if(this.state.exercises){
			var exerciseOptions = [],
				key = 0;
			_.each(this.state.exercises, function(exercise){
				var option = (
					<option key={Math.random()} value={exercise}>{exercise}</option>
				);
				exerciseOptions.push(option);
			});
			var that = this;
			var exerciseForWorkoutList = [];
			_.each(this.state.exerciseForWorkoutList, function(exercise){
				// The sequence of the 'key' and 'exerciseKey' properties is important because of the incrementation
				var element = (
					<ExerciseForWorkout key={key} exerciseKey={key++} exercise={exercise} remove={that.removeExerciseFromWorkout}/>
				);
				exerciseForWorkoutList.push(element);
			});
			var workoutReadyButton = null;
			if(this.state.exerciseForWorkoutList.length > 0){
				workoutReadyButton = (
					<button onClick={this.workoutReady}>Ready</button>
				);
			}
			return (
				<div>
					<h2>Set Workout</h2>
					{workoutReadyButton}
					<div>{this.state.selectedExercise}</div>
					<select onChange={this.changeExercise}>
						{exerciseOptions}
					</select>
					<button onClick={this.addExercise}>Add exercise</button>
					{exerciseForWorkoutList}
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

module.exports = SetWorkout;