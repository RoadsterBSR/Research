var App = (function () {
    function App() {
    }
    App.prototype.start = function () {
        var engine = new Engine(100, "BMW");
        var car = new Car(engine);
        car.start();
    };
    return App;
})();
var app = new App();
app.start();
//# sourceMappingURL=App.js.map