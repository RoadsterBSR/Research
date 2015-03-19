
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
    		app.type = hto.enums.AppTypes.Mobile;
    		app.title = "HTO Mobile";
    		
    		var cookies = $cookieStore;
    		var hub = $.connection.signatureHub;
    		var scope = $scope;
    		$scope.app = app;
    		$scope.app.activate(cookies, hub, scope);
        }

        function link($scope, $element) {
        	

        	hto.models.App.prototype.onLocationImageLoad = function (img) {
        		var self = this;
        	
        		html2canvas(img)
					.then(function (canvas) {
						//document.body.appendChild(canvas);
						//var canvas = document.createElement("canvas");
						$scope.app.locationImageDataUrl = hto.services.canvas.getDataUrlFromImage(img, canvas);
						//document.body.appendChild(canvas);
						//self.sendToDesktop('A message from the mobile application.');
					}).then(function () {
						$scope.app.sendToDesktop('A message from the mobile application.');
					});
        	}

        	hto.models.App.prototype.onSendClick = function () {
        		var self = this;
        		hto.services.geolocation.getPosition($q)
					.then(function (position) {
						self.latitude = position.coords.latitude;
						self.longitude = position.coords.longitude;
						self.locationImageUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" + self.latitude + "," + self.longitude + "&zoom=13&size=300x300&sensor=false";
					});
        	}
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

}(hto, $, document));