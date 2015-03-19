
(function (hto, $) {
    "use strict";

    function directive() {
        /// <summary>
        /// Represent the Mobile app in the ui.
        /// </summary>

    	function controller($scope) {
    		/// <summary>
    		/// When this directive is loaded, load cookie information from disk.
			/// Wireup change handler on "rememberMe", so cookie changes, when checkbox changes.
    		/// </summary>

    		var app = new hto.models.App();
    		app.title = "HTO Mobile";
    		app.rememberMe = $cookies.rememberMe;
    		app.initializeSignalR();
    		$scope.app = app;

    		$scope.$watch('app.rememberMe', function (newValue, oldValue) {
    			$cookies.rememberMe = newValue;
    		});
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