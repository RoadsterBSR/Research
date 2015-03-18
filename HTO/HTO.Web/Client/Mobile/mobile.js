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
            link: link
        };
    }

    angular
        .module("hto")
        .directive("htoMobile", [directive]);

}(hto));