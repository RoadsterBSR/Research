var HTO;
(function (HTO) {
    var Models;
    (function (Models) {
        "use strict";
        var Engine = (function () {
            function Engine(horsePower, engineType) {
                this.horsePower = horsePower;
                this.engineType = engineType;
            }
            return Engine;
        })();
        Models.Engine = Engine;
    })(Models = HTO.Models || (HTO.Models = {}));
})(HTO || (HTO = {}));
//# sourceMappingURL=Engine.js.map