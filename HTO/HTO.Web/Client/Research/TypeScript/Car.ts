/// <reference path="engine.ts" />

class Car {
	private _engine: Engine;
	constructor(engine: Engine) {
		this.engine = engine;
	}

	get engine(): Engine {
		return this._engine;
	}

	set engine(value: Engine) {
		if (value === undefined) { throw "Please supply an engine."; }
		this._engine = value;
	}

	start(): void {
		console.log("Test: " + this._engine); 
	}
}
