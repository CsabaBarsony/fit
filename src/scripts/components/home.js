/** @jsx React.DOM */

var React = require("react");
var $ = require("jquery");
var cs = require("../helpers/cs");

var Home = React.createClass({
	testGet: function(){
		cs.get("/secret", function(result){
			console.log("get working", result);
		});
	},
	testPost: function(){
		cs.post("/secret", { testData: "majom" }, function(result){
			console.log("post working", result);
		})
	},
	render: function(){
		return (
			<div>
				<h2>Home</h2>
				<button type="text" onClick={this.testGet}>Get</button>
				<button type="text" onClick={this.testPost}>Post</button>
			</div>
		);
	}
});

module.exports = Home;
