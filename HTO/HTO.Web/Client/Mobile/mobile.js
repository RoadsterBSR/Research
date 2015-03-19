
(function (hto, $) {
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

    		hto.models.App.prototype.latitude = null;
    		hto.models.App.prototype.longitude = null;

    		hto.models.App.prototype.onSendClick = function () {
    			var self = this;
    			hto.services.geolocation.getPosition($q)
					.then(function (position) {
						self.latitude = position.coords.latitude;
						self.longitude = position.coords.longitude;

						//$scope.$apply(function () {

						//	self.postion = position;
						//});
					});
    			self.sendToDesktop('A message from the mobile application.')
    		}

    		var app = new hto.models.App();
    		app.type = hto.enums.AppTypes.Mobile;
    		app.title = "HTO Mobile";
    		
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
        .directive("htoMobile", ["$cookieStore", "$q", directive]);

}(hto, $));