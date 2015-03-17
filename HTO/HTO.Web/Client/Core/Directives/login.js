
(function (hto) {
	"use strict";

	function directive() {
		/// <summary>
		/// Represent a signature pad in the ui.
		/// </summary>

		function link($scope) {
			$scope.user = new hto.models.User();
		}

		return {
			restrict: "EA",
			link: link
		};
	}

	angular
        .module("hto")
        .directive("htoLogin", [directive]);

}(hto));