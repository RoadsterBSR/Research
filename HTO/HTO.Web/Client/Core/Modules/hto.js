// This is the starting point (main) for this app.
(function (angular) {
	"use strict";

	function run() {
	
		// Initialize fastclick (this will remove 300ms delay on touch devices).
		//FastClick.attach(document.body);

	}

	angular.module("hto", [])
           .run(run);
	
}(angular));