var hto;
(function (hto) {
    var services;
    (function (services) {
        "use strict";
        var AppCache = (function () {
            function AppCache() {
                this.detectedNewVersion = false;
            }
            /**
             * Initializes the appcache event handlers.
             */
            AppCache.prototype.initialize = function () {
                // Handle new versions (appCache).
                window.applicationCache.addEventListener('updateready', this.onUpdateReady);
                if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                    this.onUpdateReady();
                }
            };
            AppCache.prototype.onUpdateReady = function () {
                if (this.detectedNewVersion === false) {
                    // New version detected. Reload the current page, without using the cache.
                    document.location.reload(true);
                }
                // Prevents 2 page reloads.
                this.detectedNewVersion = true;
            };
            return AppCache;
        })();
        services.appcache = new AppCache();
        hto.services.appcache.initialize();
    })(services = hto.services || (hto.services = {}));
})(hto || (hto = {}));
//# sourceMappingURL=appcache.js.map