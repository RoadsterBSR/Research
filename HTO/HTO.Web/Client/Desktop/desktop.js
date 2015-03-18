(function (hto) {
    "use strict";

    function directive() {
        /// <summary>
        /// Represent the desktop app in the ui.
        /// </summary>

        function link($scope, $element) {
            
        }

        return {
            restrict: "EA",
            templateUrl: 'my-customer.html',
            link: link
        };
    }

    angular
        .module("hto")
        .directive("htoDrawing", [directive]);

}(hto));