const Alexa = require('ask-sdk-core');

const RepeatHandler = {
	canHandle(handlerInput) {
		console.log("Inside RepeatHandler");
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		const request = handlerInput.requestEnvelope.request;

		return attributes.state === states.QUIZ &&
			request.type === 'IntentRequest' &&
			request.intent.name === 'AMAZON.RepeatHandler';
	},
	handle(handlerInput) {
		console.log("Inside RepeatHandler - handle");
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		const question = getQuestion(attributes.counter, attributes.quizproperty, attributes.quizitem);

		return handlerInput.responseBuilder
			.speak(question)
			.reprompt(question)
			.getResponse();
	},
};

module.exports = RepeatHandler;