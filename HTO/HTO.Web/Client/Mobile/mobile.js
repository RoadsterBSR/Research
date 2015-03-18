/// <reference path="/Client/Core/hto.js" />
/// <reference path="/Client/Core/Settings/settings.js" />
/// <reference path="/Client/Core/Models/user.js" />

(function (hto, $) {
    "use strict";

    var _hub = null;

    function Mobile() {
        /// <summary>
        /// This is the model representing the mobile application.
        /// </summary>

        this.messages = [];
        this.templateUrl = hto.settings.urls.loginTemplate;
        this.title = "HTO Mobile";
        this.user = new hto.models.User();
    }

    Mobile.prototype.getTemplateUrl = function () {
        /// <summary>
        /// Gets the template url.
        /// </summary>

        return this.templateUrl;
    };

    Mobile.prototype.handleAuthenticationResult = function () {
        /// <summary>
        /// Called, when a authentication response from the server is received.
        /// </summary>

        this.user.isAuthenticated = true;
        this.templateUrl = hto.settings.urls.mobileTemplate;
    };

    Mobile.prototype.initializeSignalR = function () {
        /// <summary>
        /// Hookup the functions that the server can call, e.g. "showMessage".
        ///
        /// Notes
        /// - "$.connection.signatureHub" is the auto-generated SignalR hub proxy.
        /// </summary>

        _hub = $.connection.signatureHub;
        _hub.client.showMessage = function (message) {
            this.messages.push(message);
        };
        _hub.start();
    };

    Mobile.prototype.sendMessage = function () {
        /// <summary>
        /// Send a message to the server.
        /// </summary>

        _hub.server.send("Dit is een test.");
    };

    function directive() {
        /// <summary>
        /// Represent the Mobile app in the ui.
        /// </summary>

        function controller($scope) {
            $scope.app = new Mobile();
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
        .directive("htoMobile", [directive]);

}(hto, $));