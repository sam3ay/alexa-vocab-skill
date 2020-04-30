import text from '../libs/handlerhelp.mjs';
import Alexa from 'ask-sdk';
const helpMessage = text.helpMessage

const HelpHandler = {
	canHandle(handlerInput) {
		console.log("Inside HelpHandler");
		const requestEnv = handlerInput.requestEnvelope;
		return Alexa.getRequestType(requestEnv) === 'IntentRequest' &&
			Alexa.getIntentName(requestEnv) === 'AMAZON.HelpHandler';
	},
	handle(handlerInput) {
		console.log("Inside HelpHandler - handle");
		return handlerInput.responseBuilder
			.speak(helpMessage)
			.reprompt(helpMessage)
			.getResponse();
	},
};

export default HelpHandler;