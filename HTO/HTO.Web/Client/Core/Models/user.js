var hto;
(function (hto) {
    var models;
    (function (models) {
        "use strict";
        /**
         * Represent a user.
         */
        var User = (function () {
            function User() {
                this.nameLabel = "Gebruikersnaam";
                this.passwordLabel = "Wachtwoord";
            }
            return User;
        })();
        models.User = User;
    })(models = hto.models || (hto.models = {}));
})(hto || (hto = {}));
//# sourceMappingURL=user.js.map