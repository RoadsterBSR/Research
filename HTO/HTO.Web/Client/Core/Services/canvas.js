
(function (hto) {
	"use strict";

	function Canvas() {
	}

	Canvas.prototype.getDataUrlFromImage = function (img, canvas, removePrefix) {
		
		// To prevent error "SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported."
		//img.setAttribute('crossOrigin', 'anonymous');

		// Make sure the canvas and image have the same dimentions.
		canvas.width = img.width;
		canvas.height = img.height;

		// Copy the image contents to the canvas
		//var ctx = canvas.getContext("2d");
		//ctx.drawImage(img, 0, 0);

		// Get the data-URL formatted image
		// Firefox supports PNG and JPEG. You could check img.src to
		// guess the original format, but be aware the using "image/jpg"
		// will re-encode the image.
		var dataURL = canvas.toDataURL("image/png");

		if (removePrefix) {
			dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		}

		return dataURL;
	};

	hto.services.canvas = new Canvas();

}(hto));