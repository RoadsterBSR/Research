
(function (hto) {
	"use strict";

	function User() {
		/// <summary>
		/// Represent a user.
	    /// </summary>
	    this.isAuthenticated = false;
	    this.name = "User 1";
	    this.nameLabel = "Gebruikersnaam";
        this.password = "";
        this.passwordLabel = "Wachtwoord";
	}

	User.prototype.authenticate = function (app) {
	    /// <summary>
	    /// Authenticates a User.
		/// It expects an app.handleAuthenticationResult function.
		/// 
		/// TODO: request for authentication.
	    /// </summary>
	    app.handleAuthenticationResult();
	};

	hto.models.User = User;
	
}(hto));