breeze.validators = breeze.validators || (function () {
    var v1 = 10; // This is a private variable shared by all instances of Greeter.

    function Validators() {
        
        this.v2 = 20; // This is a public instance variable.
        var v3 = 30; // This is a private instance variable, can only be accessed by the current Greeter instance.
    }

    Validators.prototype.v4 = 40; // This is a public variable shared by all instances of Greeter.

    Validators.prototype.increase = function () {
        v1 = v1 + 1;
        this.v2 = this.v2 + 1;
    };

    return Validators;
})();