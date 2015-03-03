// Start

console.log("Start application");


(function (require) {
	"use strict";
			
	// 'fs' is used to interact with the filesystem.
	var fs = require('fs');
	
	function readFile() {
		/// <summary>
		/// Read the contents of the JSON schema file from filesystem.
		/// </summary>
		/// <returns type="Q">A promise.</returns>
	
		fs.readFile("store.schema.json", function (err, data) {
			console.log("test");
			if (err) {
				console.log("err");
				console.log(err);
				throw err;
			}
			
			
			console.log("data");
			console.log(typeof data);
			var obj = JSON.parse(data);
			console.log("after parse");

			console.log(obj);
			
			//var dataAsString = data.toJSON();
			
			//console.log("dataAsString");
			//console.log(typeof dataAsString);
			//console.log(dataAsString);
			
			////console.log(data.toString());
			
			//var object = JSON.parse(dataAsString);
			//console.log(object);
			

			console.log("end read");
		});
	}

	readFile();
}(require));