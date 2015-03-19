
(function (hto, $) {
	/// <summary>
	/// This is the main model for the mobile and desktop application.
	/// </summary>

	"use strict";

	var _cookies = null;
	var _hub = null;

	function App() {
		this.connected = false;
		this.messages = [];
		this.receivedDateTime = null;
		this.sendDateTime = null;
		this.templateUrl = hto.settings.urls.loginTemplate;
		this.title = "";
		this.type = null;
		this.user = new hto.models.User();
	}

	App.prototype.activate = function (cookies, hub) {
		/// <summary>
		/// After the application is constructed, this function should be called to start the application.
		/// </summary>

		var self = this;

		_cookies = cookies;
		_hub = hub;

		self.storeCookieInfoOnModel();
		self.initializeSignalR();
	}

	App.prototype.authenticate = function () {
		/// <summary>
		/// Authenticates a User.
		/// It expects an app.handleAuthenticationResult function.
		/// </summary>
		var self = this;

		// TODO: request for authentication.

		self.handleAuthenticationResult();
	};

	App.prototype.getTemplateUrl = function () {
		return this.templateUrl;
	};

	App.prototype.handleAuthenticationResult = function () {
		/// <summary>
		/// This function is called, when the user is sucessfully authenticated.
		/// </summary>

		var self = this;
		self.user.isAuthenticated = true;
		self.storeCookieInfoOnDisk();

		if (self.type === hto.enums.AppTypes.Mobile) {
			self.templateUrl = hto.settings.urls.mobileTemplate;
			_hub.server.registerMobileConnectionId(self.user.name);
		} else {
			self.templateUrl = hto.settings.urls.desktopTemplate;
			_hub.server.registerDesktopConnectionId(self.user.name);
		}
	};

	App.prototype.initializeSignalR = function () {
		/// <summary>
		/// Hookup the functions that the server can call, e.g. "showMessage".
		///
		/// Notes
		/// - "$.connection.signatureHub" is the auto-generated SignalR hub proxy.
		/// </summary>
		var self = this;

		if (self.type === hto.enums.AppTypes.Mobile) {
			_hub.client.showMessageOnMobile = function (message) {
				self.receivedDateTime = new Date();
				self.messages.push(message);
			};
		} else {
			_hub.client.showMessageOnDekstop = function (message) {
				self.receivedDateTime = new Date();
				self.messages.push(message);
			};
		}

		$.connection.hub
            .start()
            .done(function () {
            	self.connected = true;

            	if (self.user.rememberMe && self.user.name) {
            		self.authenticate();
            	}
            });
	};

	App.prototype.sendToDesktop = function (message) {
		/// <summary>
		/// Send a message to the Desktop application.
		/// </summary>
		var self = this;

		if (self.connected) {
			self.sendDateTime = new Date();
			_hub.server.sendToDesktop(message, self.user.name);
		}
	};

	App.prototype.sendToMobile = function (message) {
		/// <summary>
		/// Send a message to the Mobile application.
		/// </summary>
		var self = this;

		if (self.connected) {
			self.sendDateTime = new Date();
			_hub.server.sendToMobile(message, self.user.name);
		}
	};

	App.prototype.signOut = function () {
		/// <summary>
		/// Reset user and show login.
		/// </summary>
		var self = this;

		self.user.password = null;
		self.user.name = null;
		this.templateUrl = hto.settings.urls.loginTemplate;
	};

	App.prototype.storeCookieInfoOnDisk = function () {
		/// <summary>
		/// Save information from model to cookies on disk.
		/// </summary>
		var self = this;

		if (self.type === hto.enums.AppTypes.Mobile) {
			_cookies.get("userNameOnMobile") = self.user.name;
			_cookies.get("rememberMeOnMobile") = self.user.rememberMe;

		} else {
			_cookies.get("userNameOnDesktop") = self.user.name;
			_cookies.get("rememberMeOnDesktop") = self.user.rememberMe;
		}
	};

	App.prototype.storeCookieInfoOnModel = function () {
		/// <summary>
		/// Retrieve cookie information and store on model.
		/// </summary>
		var self = this;

		if (self.type === hto.enums.AppTypes.Mobile) {
			self.user.name = _cookies.get("userNameOnMobile");
			self.user.rememberMe = _cookies.get("rememberMeOnMobile");
			
		} else {
			self.user.name = _cookies.get("userNameOnDesktop");
			self.user.rememberMe = _cookies.get("rememberMeOnDesktop");
		}
	};

	hto.models.App = App;

}(hto, $));