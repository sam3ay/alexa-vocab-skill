import text from '../libs/handlerhelp.mjs';
import Alexa from 'ask-sdk';
const exitSkillMessage = text.exitSkillMessage;

const ExitHandler = {
	canHandle(handlerInput) {
		console.log("Inside ExitHandler");
		const requestEnv = handlerInput.requestEnvelope;

		return Alexa.getRequestType(requestEnv) === `IntentRequest` && (
			Alexa.getIntentName(requestEnv) === 'AMAZON.StopIntent' ||
			Alexa.getIntentName(requestEnv) === 'AMAZON.PauseIntent' ||
			Alexa.getIntentName(requestEnv) === 'AMAZON.CancelIntent'
		);
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder
			.speak(exitSkillMessage)
			.getResponse();
	},
};

export default ExitHandler;