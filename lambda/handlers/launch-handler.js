const Alexa = require('ask-sdk-core');

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

module.exports = LaunchRequestHandler;