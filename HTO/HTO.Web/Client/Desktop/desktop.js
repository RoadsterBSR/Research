/// <reference path="/Client/Core/hto.js" />
/// <reference path="/Client/Core/Settings/settings.js" />
/// <reference path="/Client/Core/Models/user.js" />

(function (hto) {
    "use strict";

    var _hub = null;

    function Desktop() {
        this.messages = [];
        this.templateUrl = hto.settings.urls.loginTemplate;
        this.title = "HTO Desktop";
        this.user = new hto.models.User();
        this.connected = false;
    }

    Desktop.prototype.getTemplateUrl = function () {
        return this.templateUrl;
    };

    Desktop.prototype.handleAuthenticationResult = function () {
        this.user.isAuthenticated = true;
        this.templateUrl = hto.settings.urls.desktopTemplate;
    };

    Desktop.prototype.initializeSignalR = function () {
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

    Desktop.prototype.sendMessage = function () {
        /// <summary>
        /// Send a message to the server.
        /// </summary>

        if (this.connected) {
            _hub.server.send("Dit is een test.");
        }
    };

    function directive() {
        /// <summary>
        /// Represent the desktop app in the ui.
        /// </summary>

        function controller($scope) {
            $scope.app = new Desktop();
            $scope.app.initializeSignalR();
        }

        function link($scope, $element) {
            
        }

        return {
            controller: controller,
            link: link,
            restrict: "EA",
            template: '<div ng-include="app.getTemplateUrl()"></div>'
        };
    }

    angular
        .module("hto")
        .directive("htoDesktop", [directive]);

}(hto));