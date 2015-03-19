
(function (hto) {
    "use strict";

    function directive($cookieStore) {
        /// <summary>
        /// Represent the desktop app in the ui.
        /// </summary>

    	function controller($scope) {
    		/// <summary>
    		/// When this directive is loaded, construct "App" object and activate it.
    		/// </summary>

    		var app = new hto.models.App();
    		app.type = hto.enums.AppTypes.Desktop;
    		app.title = "HTO Desktop";

    		var cookies = $cookieStore;
    		var hub = $.connection.signatureHub;
    		var scope = $scope;
    		$scope.app = app;
    		$scope.app.activate(cookies, hub, scope);
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
        .directive("htoDesktop", ["$cookieStore", directive]);

}(hto));