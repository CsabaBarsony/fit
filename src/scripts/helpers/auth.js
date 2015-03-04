var auth = {
	loginPage: "/login.html",
	logout: function(callback){
		$.ajax({
			url: "/logout",
			type: 'POST',
			data: {
				username: this.getUsername()
			},
			success: function(result) {
				delete localStorage.token;
				delete localStorage.username;
				callback();
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("error while loggint out");
				delete localStorage.token;
				delete localStorage.username;
				callback();
			}.bind(this)
		});
	},
	authorize: function(callback){
		if(!this.getToken()) {
			callback(false);
			return;
		}

		$.ajax({
			url: "/authorize",
			type: 'GET',
			headers: {
				"x-auth-token": this.getToken(),
				"x-auth-username": this.getUsername()
			},
			success: function(result) {
				callback(true);
			}.bind(this),
			error: function(xhr, status, err) {
				callback(false);
			}.bind(this)
		});
	},
	getToken: function(){
		return localStorage.token;
	},
	getUsername: function(){
		return localStorage.username;
	},
	loggedIn: function(){
		return this.getToken();
	},
	onChange: function(){}
};

module.exports = auth;