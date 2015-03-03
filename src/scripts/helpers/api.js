var $ = require("jquery");
var auth = require("./auth");

module.exports = {
	log: function(text){
		console.log(text);
	},
	get: function(url, success){
		$.ajax({
			url: url,
			type: 'GET',
			headers: {
				"x-auth-token": auth.getToken(),
				"x-auth-username": auth.getUsername()
			},
			success: function(result) {
				success(result);
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(status);
				if(xhr.status >= 400) window.location.href = auth.loginPage;
			}.bind(this)
		});
	},
	post: function(url, data, success){
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			headers: {
				"x-auth-token": auth.getToken(),
				"x-auth-username": auth.getUsername()
			},
			success: function(result) {
				success(result);
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(status);
				if(xhr.status >= 400) window.location.href = auth.loginPage;
			}.bind(this)
		});
	}
};