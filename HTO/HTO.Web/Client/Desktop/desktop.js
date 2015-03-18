/// <reference path="/Client/Core/hto.js" />
/// <reference path="/Client/Core/Settings/settings.js" />
/// <reference path="/Client/Core/Models/user.js" />

(function (hto) {
    "use strict";

    function Desktop() {
        this.templateUrl = hto.settings.urls.loginTemplate;
        this.user = new hto.models.User();
        this.title = "HTO Desktop"
    }
    Desktop.prototype.handleAuthenticationResult = function () {
        this.user.isAuthenticated = true;
        this.templateUrl = hto.settings.urls.desktopTemplate;
    };

    Desktop.prototype.getTemplateUrl = function () {
        return this.templateUrl;
    };

    function directive() {
        /// <summary>
        /// Represent the desktop app in the ui.
        /// </summary>

        function controller($scope) {
            $scope.app = new Desktop();
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