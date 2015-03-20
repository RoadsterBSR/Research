
(function (hto, $) {
	/// <summary>
	/// This is the main model for the mobile and desktop application.
	/// </summary>

	"use strict";

	var _cookies = null;
	var _hub = null;
	var _q = null;
	var _scope = null;

	function App() {
		this.connected = false;
		this.latitude = null;
		this.longitude = null;
		this.locationImageUrl = null;
		this.messages = [];
		this.receivedDateTime = null;
		this.sendDateTime = null;
		this.signatureImageDataUrl = null;
		this.templateUrl = hto.settings.urls.loginTemplate;
		this.title = "";
		this.type = null;
		this.user = new hto.models.User();
	}

	App.prototype.activate = function (cookies, hub, scope, q) {
		/// <summary>
		/// After the application is constructed, this function should be called to start the application.
		/// </summary>

		var self = this;

		_cookies = cookies;
		_hub = hub;
		_q = q;
		_scope = scope;

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
				_scope.$apply(function () {
					self.receivedDateTime = new Date();
					self.messages.push(message.Message);
				});
			};
		} else {
			_hub.client.showMessageOnDekstop = function (message) {
				_scope.$apply(function () {
					self.receivedDateTime = new Date();
					self.messages.push(message.Message);
					self.latitude = message.Latitude;
					self.longitude = message.Longitude;
					self.locationImageUrl = message.LocationImageUrl;
					self.signatureImageDataUrl = message.SignatureImageDataUrl;
				});
			};
		}

		$.connection.hub
            .start()
            .done(function () {
            	_scope.$apply(function () {
            		self.connected = true;

            		if (self.user.rememberMe && self.user.name) {
            			self.authenticate();
            		}
            	});
            });
	};

	App.prototype.onSendToDekstopClick = function () {
	    var self = this;
	    hto.services.geolocation.getPosition(_q)
            .then(function (position) {
                self.latitude = position.coords.latitude;
                self.longitude = position.coords.longitude;
                self.locationImageUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" + self.latitude + "," + self.longitude + "&zoom=13&size=300x300&sensor=false";
                self.signatureImageDataUrl = hto.services.canvas.getDataUrl("pwCanvasMain", false);
                self.sendToDesktop("Een bericht van de mobiele applicatie");
            });
	}

	App.prototype.sendToDesktop = function (message) {
		/// <summary>
		/// Send a message to the Desktop application.
		/// </summary>
		var self = this;

		if (self.connected) {
		    self.sendDateTime = new Date();

			var model = new hto.models.MobileMessage();
			model.latitude = self.latitude;
			model.longitude = self.longitude;
			model.locationImageUrl = self.locationImageUrl;
			model.message = message;
			model.userName = self.user.name;
			model.signatureImageDataUrl = self.signatureImageDataUrl;
			
			_hub.server.sendToDesktop(model);
		}
	};

	App.prototype.sendToMobile = function (message) {
		/// <summary>
		/// Send a message to the Mobile application.
		/// </summary>
		var self = this;

		if (self.connected) {
			self.sendDateTime = new Date();
			var model = new hto.models.DesktopMessage();
			model.message = message;
			model.userName = self.user.name;
			_hub.server.sendToMobile(model);
		}
	};

	App.prototype.signOut = function () {
		/// <summary>
		/// Reset user and show login.
		/// </summary>
		var self = this;

		self.user.isAuthenticated = false;
		self.user.password = "";
		self.user.name = "";
		self.user.rememberMe = false;
		self.storeCookieInfoOnDisk();

		this.templateUrl = hto.settings.urls.loginTemplate;
	};

	App.prototype.storeCookieInfoOnDisk = function () {
		/// <summary>
		/// Save information from model to cookies on disk.
		/// </summary>
		var self = this;

		if (self.type === hto.enums.AppTypes.Mobile) {
			if (self.user.name && self.user.name !== "undefined") {
				_cookies.put("userNameOnMobile", self.user.name);
			} else {
				_cookies.put("userNameOnMobile", "");
			}

			if (self.user.rememberMe && self.user.rememberMe !== "undefined") {
				_cookies.put("rememberMeOnMobile", true);
			} else {
				_cookies.put("rememberMeOnMobile", false);
			}
		} else {
			if (self.user.name && self.user.name !== "undefined") {
				_cookies.put("userNameOnDesktop", self.user.name);
			} else {
				_cookies.put("userNameOnDesktop", "");
			}

			if (self.user.rememberMe && self.user.rememberMe !== "undefined") {
				_cookies.put("rememberMeOnDesktop", true);
			} else {
				_cookies.put("rememberMeOnDesktop", false);
			}
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