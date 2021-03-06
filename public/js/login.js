$("#login-form").submit(function(e){
	e.preventDefault();
	var username = $("#username").val();
	var password = $("#password").val();
	$.ajax({
		url: "/login",
		type: 'POST',
		data: {
			username: username,
			password: password
		},
		success: function(result) {
			if(result.success){
				localStorage.token = result.token;
				localStorage.username = username;
				$("login-form").off("submit");
				$("submit-button").click();
				window.location.href = "/";
			}
			else{
				alert(result.reason);
			}
		}.bind(this),
		error: function(xhr, status, err) {
			console.error(status, err);
		}.bind(this)
	});
});