var hto;
(function (hto) {
    var models;
    (function (models) {
        "user strict";
        /**
         * This is the main model for the mobile and desktop application.
         */
        var App = (function () {
            function App() {
                this.chatMessages = [];
                this.messages = [];
                this.user = new hto.models.User();
            }
            App.prototype.activate = function () {
                /// <summary>
                /// After the application is constructed, this function should be called to start the application.
                /// </summary>
                var self = this;
                self.copyCookieInfoToModel();
                self.initializeSignalR();
            };
            App.prototype.authenticate = function () {
                /// <summary>
                /// Authenticates a User.
                /// It expects an app.handleAuthenticationResult function.
                /// </summary>
                var self = this;
                if (self.connected) {
                    self.hub.server.authenticate(self.user.name, self.user.password, self.user.token, self.appType).done(function (token) {
                        self.scope.$apply(function () {
                            self.handleAuthenticationResult(token);
                        });
                    });
                }
            };
            App.prototype.copyCookieInfoToModel = function () {
                /// <summary>
                /// Retrieve cookie information and store on model.
                /// </summary>
                var self = this;
                if (self.appType === 2 /* Mobile */) {
                    self.user.name = self.cookies.get("userNameOnMobile") || "";
                    self.user.password = self.cookies.get("passwordOnMobile") || "";
                    self.user.rememberMe = self.cookies.get("rememberMeOnMobile") || false;
                    self.user.token = self.cookies.get("tokenOnMobile") || "";
                }
                else {
                    self.user.name = self.cookies.get("userNameOnDesktop") || "";
                    self.user.password = self.cookies.get("passwordOnDesktop") || "";
                    self.user.rememberMe = self.cookies.get("rememberMeOnDesktop") || false;
                    self.user.token = self.cookies.get("tokenOnDesktop") || "";
                }
            };
            App.prototype.getTemplateUrl = function () {
                var self = this;
                return self.templateUrl;
            };
            App.prototype.handleAuthenticationResult = function (token) {
                /// <summary>
                /// This function is called, when the user is sucessfully authenticated.
                /// </summary>
                var self = this;
                if (token) {
                    self.user.token = token;
                    self.user.isAuthenticated = true;
                    self.saveCookie();
                    if (self.appType === 2 /* Mobile */) {
                        self.templateUrl = hto.settings.urls.mobileTemplate;
                    }
                    else {
                        self.templateUrl = hto.settings.urls.desktopTemplate;
                    }
                }
                else {
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
                self.hub.client.showChat = function (message) {
                    self.scope.$apply(function () {
                        message.ReceivedDateTime = new Date();
                        self.chatMessages.push(message);
                    });
                };
                self.hub.client.showSignature = function (message) {
                    self.scope.$apply(function () {
                        self.receivedDateTime = new Date();
                        self.messages.push(message.Message);
                        self.latitude = message.Latitude;
                        self.longitude = message.Longitude;
                        self.locationImageUrl = message.LocationImageUrl;
                        self.signatureImageDataUrl = message.SignatureImageDataUrl;
                    });
                };
                $.connection.hub.start().done(function () {
                    self.scope.$apply(function () {
                        self.connected = true;
                        self.authenticate();
                    });
                });
            };
            App.prototype.onSendSignatureClick = function () {
                var self = this;
                hto.services.geolocation.getPosition(self.q).then(function (position) {
                    self.latitude = position.coords.latitude;
                    self.longitude = position.coords.longitude;
                    self.locationImageUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" + self.latitude + "," + self.longitude + "&zoom=13&size=300x300&sensor=false";
                    self.signatureImageDataUrl = hto.services.canvas.getDataUrl("pwCanvasMain", false);
                    self.sendSignature("Message from mobile.");
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
                model.appType = self.appType;
                model.message = self.chatMessage;
                model.receivedDateTime = null;
                model.sendDateTime = new Date();
                model.token = self.user.token;
                self.hub.server.sendChat(model);
            };
            App.prototype.sendSignature = function (message) {
                /// <summary>
                /// Send a message to the Desktop application.
                /// </summary>
                var self = this;
                if (self.connected) {
                    self.sendDateTime = new Date();
                    var model = new hto.models.SignatureMessage();
                    model.appType = self.appType;
                    model.latitude = self.latitude;
                    model.longitude = self.longitude;
                    model.locationImageUrl = self.locationImageUrl;
                    model.message = message;
                    model.signatureImageDataUrl = self.signatureImageDataUrl;
                    model.token = self.user.token;
                    self.hub.server.sendSignature(model);
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
                self.saveCookie();
                this.templateUrl = hto.settings.urls.loginTemplate;
            };
            App.prototype.saveCookie = function () {
                /// <summary>
                /// Save information from model to cookies on disk.
                /// </summary>
                var self = this;
                if (self.appType === 2 /* Mobile */) {
                    if (self.user.name && self.user.name !== "undefined") {
                        self.cookies.put("userNameOnMobile", self.user.name);
                    }
                    else {
                        self.cookies.put("userNameOnMobile", "");
                    }
                    if (self.user.rememberMe) {
                        self.cookies.put("rememberMeOnMobile", true);
                        if (self.user.password && self.user.password !== "undefined") {
                            self.cookies.put("passwordOnMobile", self.user.password);
                        }
                    }
                    else {
                        self.cookies.put("rememberMeOnMobile", false);
                        self.cookies.put("passwordOnMobile", "");
                    }
                    if (self.user.token && self.user.token !== "undefined") {
                        self.cookies.put("tokenOnMobile", self.user.token);
                    }
                    else {
                        self.cookies.put("tokenOnMobile", "");
                    }
                }
                else {
                    if (self.user.name && self.user.name !== "undefined") {
                        self.cookies.put("userNameOnDesktop", self.user.name);
                    }
                    else {
                        self.cookies.put("userNameOnDesktop", "");
                    }
                    if (self.user.rememberMe) {
                        self.cookies.put("rememberMeOnDesktop", true);
                        if (self.user.password && self.user.password !== "undefined") {
                            self.cookies.put("passwordOnDesktop", self.user.password);
                        }
                    }
                    else {
                        self.cookies.put("rememberMeOnDesktop", false);
                        self.cookies.put("passwordOnDesktop", "");
                    }
                    if (self.user.token && self.user.token !== "undefined") {
                        self.cookies.put("tokenOnDesktop", self.user.token);
                    }
                    else {
                        self.cookies.put("tokenOnDesktop", "");
                    }
                }
            };
            return App;
        })();
        models.App = App;
    })(models = hto.models || (hto.models = {}));
})(hto || (hto = {}));
//# sourceMappingURL=app.js.map