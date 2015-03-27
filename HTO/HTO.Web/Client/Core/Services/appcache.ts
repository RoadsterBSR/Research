module hto.services {
    "use strict";

    class AppCache {
        detectedNewVersion = false;

        /**
         * Initializes the appcache event handlers.
         */
        initialize() {
            
            // Handle new versions (appCache).
            window.applicationCache.addEventListener('updateready', this.onUpdateReady);
            if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
                this.onUpdateReady();
            }
        }

        onUpdateReady() {

            if (this.detectedNewVersion === false) {
                // New version detected. Reload the current page, without using the cache.
                document.location.reload(true);
            }

            // Prevents 2 page reloads.
            this.detectedNewVersion = true;
        }
    }

    export var appcache = new AppCache();
    hto.services.appcache.initialize();
}