import text from '../libs/handlerhelp.mjs';
const welcomeMessage = text.welcomeMessage
const helpMessage = text.helpMessage

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder
			.speak(welcomeMessage)
			.reprompt(helpMessage)
			.getResponse();
	},
};

export default LaunchRequestHandler;