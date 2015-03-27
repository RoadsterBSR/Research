var hto;
(function (hto) {
    var services;
    (function (services) {
        var Canvas = (function () {
            function Canvas() {
            }
            Canvas.prototype.getDataUrl = function (id, removePrefix) {
                var canvas = document.getElementById(id);
                var dataURL = canvas.toDataURL("image/png");
                if (removePrefix) {
                    dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                }
                return dataURL;
            };
            return Canvas;
        })();
        services.canvas = new Canvas();
    })(services = hto.services || (hto.services = {}));
})(hto || (hto = {}));
//# sourceMappingURL=canvas.js.map