
(function (hto) {
    "use strict";

    function directive($cookies) {
        /// <summary>
        /// Represent the desktop app in the ui.
        /// </summary>

    	function controller($scope) {
    		/// <summary>
    		/// When this directive is loaded, load cookie information from disk.
    		/// Wireup change handler on "rememberMe", so cookie changes, when checkbox changes.
			/// When cookie, contains "rememberMe" === true, then directly authenticate user.
    		/// </summary>

    		var app = new hto.models.App();
        	app.title = "HTO Desktop";
        	app.rememberMe = $cookies.rememberMe;
        	app.initializeSignalR();
        	$scope.app = app;

        	$scope.$watch('app.rememberMe', function (newValue, oldValue) {
        		$cookies.rememberMe = newValue;
        	});

        	if (app.rememberMe) {
        		app.user.authenticate(app);
        	}
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
        .directive("htoDesktop", ["$cookies", directive]);

}(hto));