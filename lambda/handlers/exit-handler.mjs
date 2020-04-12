import * as Alexa from 'ask-sdk-core';

const ExitHandler = {
	canHandle(handlerInput) {
		console.log("Inside ExitHandler");
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		const request = handlerInput.requestEnvelope.request;

		return request.type === `IntentRequest` && (
			request.intent.name === 'AMAZON.StopIntent' ||
			request.intent.name === 'AMAZON.PauseIntent' ||
			request.intent.name === 'AMAZON.CancelIntent'
		);
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder
			.speak(exitSkillMessage)
			.getResponse();
	},
};

export { ExitHandler }