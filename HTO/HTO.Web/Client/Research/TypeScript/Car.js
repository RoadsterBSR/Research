/// <reference path="engine.ts" />
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
        console.log("Test: " + this._engine);
    };
    return Car;
})();
//# sourceMappingURL=Car.js.map