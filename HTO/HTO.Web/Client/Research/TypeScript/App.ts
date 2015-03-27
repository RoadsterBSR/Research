module HTO {
    export class App {
        start(): void {
            var engine: HTO.Models.Engine = new HTO.Models.Engine(100, "BMW");
            var car: HTO.Models.Car = new HTO.Models.Car(engine);
            car.start();
            var table: HTMLTableElement = document.createElement("table");
        }
    }
}

var app = new HTO.App();
app.start();
