
(function (hto, $) {
	/// <summary>
	/// This is the main model for the mobile and desktop application.
	/// </summary>

	"use strict";

	var _hub = null;

	function App() {
		this.connected = false;
		this.messages = [];
		this.rememberMe = false;
		this.templateUrl = hto.settings.urls.loginTemplate;
		this.title = "";
		this.user = new hto.models.User();
	}

	App.prototype.getTemplateUrl = function () {
		return this.templateUrl;
	};

	App.prototype.handleAuthenticationResult = function () {
		this.user.isAuthenticated = true;
		this.templateUrl = hto.settings.urls.desktopTemplate;
	};

	App.prototype.initializeSignalR = function () {
		/// <summary>
		/// Hookup the functions that the server can call, e.g. "showMessage".
		///
		/// Notes
		/// - "$.connection.signatureHub" is the auto-generated SignalR hub proxy.
		/// </summary>
		var self = this;

		_hub = $.connection.signatureHub;
		_hub.client.showMessage = function (message) {
			self.messages.push(message);
		};
		$.connection.hub
            .start()
            .done(function () {
            	self.connected = true;
            });
	};

	App.prototype.sendMessage = function () {
		/// <summary>
		/// Send a message to the server.
		/// </summary>

		if (this.connected) {
			_hub.server.send("Dit is een test.");
		}
	};

	hto.models.App = App;

}(hto, $));