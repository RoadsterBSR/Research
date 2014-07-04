
var vanilla  = (function () {
    var self = {};

    self.isNullOrUndefined = function (arg1) {
        if (arg1 == null) { throw new Error("Variable [arg1] is null or undefined."); }
    };

    return self;
})();