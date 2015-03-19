
(function () {
    /// <summary>
    /// Zet de focus naar het element, zodra deze in de DOM wordt gezet.
    /// </summary>
    "use strict";

    function directive() {
        
    	function link($scope, $element, attrs) {

    		$element.bind('load', function () {

    			$scope.options.load($element[0]);
        		//call the function that was passed
        		//$scope.$apply(function () {
        			
        		//});
        	});

        }

        return {
        	restrict: "A",
        	scope: {
        		options: "=htoOnload"
        	},
        	link: link
        };
    }

    angular
        .module("hto")
        .directive("htoOnload", [directive]);

}());