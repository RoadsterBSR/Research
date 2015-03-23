
(function (hto, window, document) {
	"use strict";

	function GlobalErrorHandling() {
	}

	GlobalErrorHandling.prototype.activate = function () {
		window.onerror = this.showError;
	};

	GlobalErrorHandling.prototype.showError = function (errorMsg, url, lineNumber, column, errorObj) {
	    var message = "";
	    if (errorMsg) {
	        message += "<p>Message: " + errorMsg + "</p>";
	    }

	    if (url) {
	        message += "<p>Url: " + url + "</p>";
	    }

	    if (lineNumber) {
	        message += "<p>LineNumber: " + lineNumber + "</p>";
	    }

	    if (column) {
	        message += "<p>Column: " + column + "</p>";
	    }

	    if (errorObj) {
	        message += "<p>Error: " + errorObj + "</p>";
	    }

	    document.open();
	    document.write("<div>" + message + "</div>");
	    document.close();
	};

	hto.services.globalErrorHandling = new GlobalErrorHandling();
	hto.services.globalErrorHandling.activate();

}(hto, window, document));