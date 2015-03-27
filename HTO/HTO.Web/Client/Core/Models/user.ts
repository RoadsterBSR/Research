module hto.models {

    "use strict";

    /**
     * Represent a user.
     */
    export class User {

        isAuthenticated: boolean;
        name: string;
        nameLabel: string;
        password: string;
        passwordLabel: string;
        rememberMe: boolean;
        token: string;

        constructor() {
            this.nameLabel = "Gebruikersnaam";
            this.passwordLabel = "Wachtwoord";
        }
    }
}