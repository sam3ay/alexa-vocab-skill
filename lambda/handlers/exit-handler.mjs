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
	async handle(handlerInput) {
		const attributes = await handlerInput.attributesManager.getSessionAttributes();
		await handlerInput.attributesManager.setPersistentAttributes(attributes.flashCards);
		await handlerInput.attributesManager.savePersistentAttributes();
		return handlerInput.responseBuilder
			.speak(exitSkillMessage)
			.getResponse();
	},
};

export default ExitHandler;