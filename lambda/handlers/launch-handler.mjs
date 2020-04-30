import text from '../libs/handlerhelp.mjs';
import Alexa from 'ask-sdk'
import _ from 'lodash';
const welcomeMessage = text.welcomeMessage
const helpMessage = text.helpMessage
const newWelcomeMessage = text.newWelcomeMessage

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === `LaunchRequest`;
	},
	async handle(handlerInput) {
		const attributes = await handlerInput.attributesManager.getPersistentAttributes();
		if (_.isEmpty(attributes)) {
			return handlerInput.responseBuilder
				.speak(newWelcomeMessage)
				.reprompt(helpMessage)
				.getResponse();
		} else {
			return handlerInput.responseBuilder
				.speak(welcomeMessage)
				.reprompt(helpMessage)
				.getResponse();
		}
	},
};

export default LaunchRequestHandler;