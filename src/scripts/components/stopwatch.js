/** @jsx React.DOM */

var Stopwatch = React.createClass({
	getInitialState: function(){
		return {
			ts: 0
		};
	},
	start: function(restart){
		if(restart) this.state.ts = 0;
		var that = this;
		this.interval = setInterval(function(){
			that.setState({
				phase: "run",
				ts: that.state.ts + 100
			});
		}, 100);
		this.paused = false;
	},
	pause: function(){
		clearInterval(this.interval);
		this.paused = true;
		this.props.getTs(this.state.ts);
	},
	interval: 0,
	paused: false,
	render: function(){
		if(this.props.phase === "exercise" && (this.state.ts === 0 || this.paused)){
			this.start(this.paused);
		}
		if(this.props.phase === "pause"){
			this.pause();
		}
		return (
			<div>
				<p>{this.state.ts}</p>
			</div>
		);
	}
});

module.exports = Stopwatch;