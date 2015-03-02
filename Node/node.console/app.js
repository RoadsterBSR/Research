console.log('Hello world1');
debugger;
console.log('Hello world2');

var del = require('del');

console.log('Hello world 3');

var Q = require('Q');

function cleanFolder() {

	var deferred = Q.defer()

	del(['C:\Temp\temp2\**'], function (err, deletedFiles) {
		console.log('Files deleted:', deletedFiles.join(', '));
		deferred.resolve(deletedFiles);
	});
	// Fake ajax call
	
	
	return deferred.promise;
}

cleanFolder().then(function (data) { 
	console.log("Finished");
});
