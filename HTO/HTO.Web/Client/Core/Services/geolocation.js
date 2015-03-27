var hto;
(function (hto) {
    var services;
    (function (services) {
        var Geolocation = (function () {
            function Geolocation() {
            }
            Geolocation.prototype.getPosition = function (q) {
                var deferred = q.defer();
                function onError() {
                    deferred.reject(new Error("Unable to get current position."));
                }
                function onSuccess(position) {
                    deferred.resolve(position);
                }
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
                return deferred.promise;
            };
            Geolocation.prototype.isSupported = function () {
                var result = false;
                if (navigator.geolocation) {
                    result = true;
                }
                return result;
            };
            return Geolocation;
        })();
        services.geolocation = new Geolocation();
    })(services = hto.services || (hto.services = {}));
})(hto || (hto = {}));
//# sourceMappingURL=geolocation.js.map