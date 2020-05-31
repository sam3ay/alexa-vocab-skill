import ask from 'ask-sdk-test';
import v4 from 'uuid';

export const skillSettings = {
    appId: process.env.AMZN_APP_ID,
    userId: 'amzn1.ask.account.VOID',
    deviceId: 'amzn1.ask.device.VOID',
    locale: 'en-US',
    debug: true,
};

/**
 * Class representing an Intent request from Alexa
 */
// TODO Check for intent dialog delegate 
export class IntentBuilder extends ask.IntentRequestBuilder {
    /**
     * 
     * @param {object} settings Object containing skill settings
     * @param {string} intentName Name of intent Alexa will send
     */
    constructor(settings, intentName) {
        super(settings, intentName);
    };
    withDialogState(dialogState) {
        this.dialogState = dialogState;
        return this
    };
    withConfirmationStatus(confirmState) {
        this.confirmState = confirmState;
        return this;
    };
    buildRequest() {
        return {
            type: 'IntentRequest',
            requestId: `EdwRequestId.${v4()}`,
            timestamp: new Date().toISOString(),
            locale: this.settings.locale,
            intent: {
                name: this.intentName,
                slots: this.slots,
                confirmationStatus: this.confirmState,
            },
            dialogState: this.dialogState,
        };
    };
};
