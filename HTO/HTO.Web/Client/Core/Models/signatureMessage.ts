module hto.models {

    "use strict";

    /**
     * Represents a message sent from the mobile application.
     */
    export class SignatureMessage {

        appType: hto.enums.AppTypes;
        latitude: number;
        longitude: number;
        locationImageUrl: string;
        message: string;
        signatureImageDataUrl: string;
        token: string;

    }
}
