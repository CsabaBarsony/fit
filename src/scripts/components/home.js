/** @jsx React.DOM */

var api = require("../helpers/api");

var Home = React.createClass({
	testGet: function(){
		api.get("/secret", function(result){
			console.log("get working", result);
		});
	},
	testPost: function(){
		api.post("/secret", { testData: "majom" }, function(result){
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
