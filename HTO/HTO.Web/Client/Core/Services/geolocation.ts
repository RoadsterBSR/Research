module hto.services {
    class Geolocation {
        getPosition(q) {
            var deferred = q.defer();
		
            function onError() {
                deferred.reject(new Error("Unable to get current position."));
            }

            function onSuccess(position) {
                deferred.resolve(position);
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);

            return deferred.promise;
        }

        isSupported() {
            var result = false;
            if (navigator.geolocation) {
                result = true;
            }
            return result;
        }
    }

    export var geolocation = new Geolocation();
}