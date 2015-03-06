/** @jsx React.DOM */

var ExerciseForWorkout = React.createClass({
	remove: function(){
		this.props.remove(this.props.exerciseKey);
	},
	render: function(){
		var exercise = this.props.exercise;
		return (
			<div>
				<span>{exercise.name} {exercise.weight} kg</span><button onClick={this.remove}>remove</button>
			</div>
		);
	}
});

module.exports = ExerciseForWorkout;