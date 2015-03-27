module hto.models {

    "use strict";

    /**
     * Represents a chat message, can be sent and received from both the desktop as the mobile application.
     */
    export class ChatMessage {

        appType: hto.enums.AppTypes;
        message: string;
        receivedDateTime: Date;
        sendDateTime: Date;
        token: string;

    }
}
