var hto;
(function (hto, $, document) {
    "use strict";

    function directive($cookieStore, $q) {
        /// <summary>
        /// Represent the Mobile app in the ui.
    	/// </summary>

    	function controller($scope) {
    		/// <summary>
    		/// When this directive is loaded, load cookie information from disk.
			/// Wireup change handler on "rememberMe", so cookie changes, when checkbox changes.
    		/// </summary>
			
    	    var app = new hto.models.App();
    	    app.cookies = $cookieStore;
    	    app.hub = $.connection.signatureHub;
    	    app.q = $q;
    	    app.scope = $scope;
    	    app.appType = hto.enums.AppTypes.Mobile;
    		app.title = "HTO Mobile";

    		$scope.app = app;
    		$scope.app.activate();
        }

        function link($scope, $element) {
            $scope.undo = function () {
                this.version--;
            };
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
        .directive("htoMobile", ["$cookieStore", "$q", directive]);

}(hto || (hto = {}), $, document));