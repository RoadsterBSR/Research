var HTO;
(function (HTO) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.start = function () {
            var engine = new HTO.Models.Engine(100, "BMW");
            var car = new HTO.Models.Car(engine);
            car.start();
            var table = document.createElement("table");
        };
        return App;
    })();
    HTO.App = App;
})(HTO || (HTO = {}));
var app = new HTO.App();
app.start();
//# sourceMappingURL=App.js.map