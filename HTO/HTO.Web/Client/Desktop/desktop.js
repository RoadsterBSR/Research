var hto;
(function (hto) {
    "use strict";

    function directive($cookieStore, $q) {
        /// <summary>
        /// Represent the desktop app in the ui.
        /// </summary>

    	function controller($scope) {
    		/// <summary>
    		/// When this directive is loaded, construct "App" object and activate it.
    		/// </summary>

    	    var app = new hto.models.App();
    	    app.cookies = $cookieStore;
    	    app.hub = $.connection.signatureHub;
    	    app.q = $q;
    	    app.scope = $scope;
    		app.appType = hto.enums.AppTypes.Desktop;
    		app.title = "HTO Desktop";

    		$scope.app = app;
    		$scope.app.activate();
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
        .directive("htoDesktop", ["$cookieStore", "$q", directive]);

}(hto || (hto = {})));