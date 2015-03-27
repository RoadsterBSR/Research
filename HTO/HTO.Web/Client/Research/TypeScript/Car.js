var HTO;
(function (HTO) {
    var Models;
    (function (Models) {
        "use strict";
        var Car = (function () {
            function Car(engine) {
                this.engine = engine;
            }
            Object.defineProperty(Car.prototype, "engine", {
                get: function () {
                    return this._engine;
                },
                set: function (value) {
                    if (value === undefined) {
                        throw "Please supply an engine.";
                    }
                    this._engine = value;
                },
                enumerable: true,
                configurable: true
            });
            Car.prototype.start = function () {
                console.log("Horsepower:" + this._engine.horsePower);
            };
            return Car;
        })();
        Models.Car = Car;
    })(Models = HTO.Models || (HTO.Models = {}));
})(HTO || (HTO = {}));
//# sourceMappingURL=Car.js.map