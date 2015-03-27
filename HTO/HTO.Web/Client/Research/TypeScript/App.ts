class App {
	start(): void {
		var engine: Engine = new Engine(100, "BMW");
		var car: Car = new Car(engine);
		car.start();
	}
}
var app = new App();
app.start();
