﻿
(function (hto, $, document) {
	/// <summary>
	/// This is the main model for the mobile and desktop application.
	/// </summary>

	"use strict";

	var _cookies = null;
	var _hub = null;
	var _q = null;
	var _scope = null;

	function App() {
	    this.chatMessage = null;
	    this.chatMessages = [];
		this.connected = false;
		this.latitude = null;
		this.longitude = null;
		this.locationImageUrl = null;
		this.messages = [];
		this.receivedDateTime = null;
		this.sendDateTime = null;
		this.signatureImageDataUrl = null;
		this.templateUrl = "";
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
	};

	App.prototype.authenticate = function () {
		/// <summary>
		/// Authenticates a User.
		/// It expects an app.handleAuthenticationResult function.
		/// </summary>
		var self = this;

		if (self.connected) {
			_hub.server.getToken(self.user.name, self.user.password, self.user.token, self.type)
			.done(function (token) {
				_scope.$apply(function () {
					self.handleAuthenticationResult(token);
				});
			});
		}
	};

	App.prototype.getTemplateUrl = function () {
		return this.templateUrl;
	};

	App.prototype.handleAuthenticationResult = function (token) {
		/// <summary>
		/// This function is called, when the user is sucessfully authenticated.
		/// </summary>

		var self = this;

		if (token) {
			self.user.token = token;
			self.user.isAuthenticated = true;
			self.storeCookieInfoOnDisk();

			if (self.type === hto.enums.AppTypes.Mobile) {
				self.templateUrl = hto.settings.urls.mobileTemplate;
			} else {
				self.templateUrl = hto.settings.urls.desktopTemplate;
			}
		} else {
			self.templateUrl = hto.settings.urls.loginTemplate;
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

        // Both desktop and client use the same function to show chat messages.
		_hub.client.showChat = function (message) {
		    _scope.$apply(function () {
		        message.ReceivedDateTime = new Date();
		        self.chatMessages.push(message);
		    });
		};

		_hub.client.showSignature = function (message) {
			_scope.$apply(function () {
				self.receivedDateTime = new Date();
				self.messages.push(message.Message);
				self.latitude = message.Latitude;
				self.longitude = message.Longitude;
				self.locationImageUrl = message.LocationImageUrl;
				self.signatureImageDataUrl = message.SignatureImageDataUrl;
			});
		};

		$.connection.hub
            .start()
            .done(function () {
            	_scope.$apply(function () {
            		self.connected = true;
            		self.authenticate();
            	});
            });
	};

	App.prototype.onSendSignatureClick = function () {
	    var self = this;
	    hto.services.geolocation.getPosition(_q)
            .then(function (position) {
                self.latitude = position.coords.latitude;
                self.longitude = position.coords.longitude;
                self.locationImageUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" + self.latitude + "," + self.longitude + "&zoom=13&size=300x300&sensor=false";
                self.signatureImageDataUrl = hto.services.canvas.getDataUrl("pwCanvasMain", false);
                self.sendSignature();
            });
	};

	App.prototype.refresh = function () {
	    /// <summary>
	    /// Reload the current page, without using the cache.
	    /// </summary>

	    document.location.reload(true);
	};

	App.prototype.sendChat = function () {
	    /// <summary>
	    /// Send chat message.
	    /// </summary>

	    var self = this;
	    var model = new hto.models.ChatMessage();
	    model.appType = self.type;
	    model.message = self.chatMessage;
	    model.receivedDateTime = null;
	    model.sendDateTime = new Date();
	    model.token = self.user.token;
	    model.userName = self.user.name;

	    _hub.server.sendChat(model);
	};

	App.prototype.sendSignature = function (message) {
		/// <summary>
		/// Send a message to the Desktop application.
		/// </summary>
		var self = this;

		if (self.connected) {
		    self.sendDateTime = new Date();

		    var model = new hto.models.SignatureMessage();
		    model.appType = self.type;
			model.latitude = self.latitude;
			model.longitude = self.longitude;
			model.locationImageUrl = self.locationImageUrl;
			model.message = message;
			model.signatureImageDataUrl = self.signatureImageDataUrl;
			model.token = self.user.token;
			model.userName = self.user.name;
			
			_hub.server.sendSignature(model);
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
		self.user.token = "";
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
				if (self.user.password && self.user.password !== "undefined") {
					_cookies.put("passwordOnMobile", self.user.password);
				}
			} else {
				_cookies.put("rememberMeOnMobile", false);
				_cookies.put("passwordOnMobile", "");
			}

			if (self.user.token && self.user.token !== "undefined") {
				_cookies.put("tokenOnMobile", self.user.token);
			} else {
				_cookies.put("tokenOnMobile", "");
			}
		} else {
			if (self.user.name && self.user.name !== "undefined") {
				_cookies.put("userNameOnDesktop", self.user.name);
			} else {
				_cookies.put("userNameOnDesktop", "");
			}

			if (self.user.rememberMe && self.user.rememberMe !== "undefined") {
				_cookies.put("rememberMeOnDesktop", true);
				if (self.user.password && self.user.password !== "undefined") {
					_cookies.put("passwordOnDesktop", self.user.password);
				}
			} else {
				_cookies.put("rememberMeOnDesktop", false);
				_cookies.put("passwordOnDesktop", "");
			}

			if (self.user.token && self.user.token !== "undefined") {
				_cookies.put("tokenOnDesktop", self.user.token);
			} else {
				_cookies.put("tokenOnDesktop", "");
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
			self.user.password = _cookies.get("passwordOnMobile");
			self.user.rememberMe = _cookies.get("rememberMeOnMobile");
			self.user.token = _cookies.get("tokenOnMobile");
			
		} else {
			self.user.name = _cookies.get("userNameOnDesktop");
			self.user.password = _cookies.get("passwordOnDesktop");
			self.user.rememberMe = _cookies.get("rememberMeOnDesktop");
			self.user.token = _cookies.get("tokenOnDesktop");
		}
	};

	hto.models.App = App;

}(hto, $, document));