const Alexa = require('ask-sdk-core');

const HelpHandler = {
	canHandle(handlerInput) {
		console.log("Inside HelpHandler");
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' &&
			request.intent.name === 'AMAZON.HelpHandler';
	},
	handle(handlerInput) {
		console.log("Inside HelpHandler - handle");
		return handlerInput.responseBuilder
			.speak(helpMessage)
			.reprompt(helpMessage)
			.getResponse();
	},
};

module.exports = HelpHandler;