/// <reference path="/Client/Core/hto.js" />
/// <reference path="/Client/Core/Settings/settings.js" />
/// <reference path="/Client/Core/Models/user.js" />

(function (hto) {
    "use strict";

    function Mobile() {
        this.templateUrl = hto.settings.urls.loginTemplate;
        this.user = new hto.models.User();
        this.title = "HTO Mobile"
    }
    Mobile.prototype.handleAuthenticationResult = function () {
        this.user.isAuthenticated = true;
        this.templateUrl = hto.settings.urls.mobileTemplate;
    };

    Mobile.prototype.getTemplateUrl = function () {
        return this.templateUrl;
    };

    function directive() {
        /// <summary>
        /// Represent the Mobile app in the ui.
        /// </summary>

        function controller($scope) {
            $scope.app = new Mobile();
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

}(hto));