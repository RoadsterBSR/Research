var hto;
(function (hto) {
    var services;
    (function (services) {
        "use strict";
        var GlobalErrorHandling = (function () {
            function GlobalErrorHandling() {
            }
            GlobalErrorHandling.prototype.activate = function () {
                window.onerror = this.showError;
            };
            GlobalErrorHandling.prototype.removeNotification = function () {
                /// <summary>
                /// Remove all error notifications from the DOM.
                /// </summary>
                var notification = document.getElementById("hto-error-notification");
                if (notification) {
                    notification.parentElement.removeChild(notification);
                }
            };
            GlobalErrorHandling.prototype.readMore = function () {
                //var notifications = document.getElementsByClassName
                var notification = document.getElementById("hto-error-notification");
                var detail = notification.getElementsByClassName("hto-detail")[0];
                detail.style.display = "block";
            };
            GlobalErrorHandling.prototype.showError = function (event, url, lineNumber, columnNumber, errorObject) {
                /// <summary>
                /// Show the error to the user.
                /// </summary>
                var errorMsg = event;
                if (!errorMsg) {
                    errorMsg = "Unknown error";
                }
                var content = '';
                var close = '<button class="hto-close-button" onclick="hto.services.globalErrorHandling.removeNotification()" type="button"><span>×</span></button>';
                content += close;
                var strong = '<strong>' + errorMsg + '</strong>';
                content += strong;
                var readMore = '<button class="hto-read-more-button" onclick="hto.services.globalErrorHandling.readMore()" type="button">Read more...</button>';
                content += readMore;
                var detail = '<div class="hto-detail">';
                if (url) {
                    detail += "<p>Url: " + url + "</p>";
                }
                if (lineNumber) {
                    detail += "<p>LineNumber: " + lineNumber + "</p>";
                }
                if (columnNumber) {
                    detail += "<p>Column: " + columnNumber + "</p>";
                }
                if (errorObject) {
                    detail += "<p>Error: " + errorObject + "</p>";
                }
                detail += '</div>';
                content += detail;
                var notification = document.createElement("div");
                notification.setAttribute("id", "hto-error-notification");
                notification.innerHTML = content;
                hto.services.globalErrorHandling.removeNotification();
                var first = document.body.children[0];
                document.body.insertBefore(notification, first);
            };
            return GlobalErrorHandling;
        })();
        services.globalErrorHandling = new GlobalErrorHandling();
        hto.services.globalErrorHandling.activate();
    })(services = hto.services || (hto.services = {}));
})(hto || (hto = {}));
//# sourceMappingURL=global.error.handling.js.map