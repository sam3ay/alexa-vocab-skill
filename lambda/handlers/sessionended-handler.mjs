import Alexa from 'ask-sdk';

const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		console.log("Inside SessionEndedRequestHandler");
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
	},
	async handle(handlerInput) {
		const attributes = await handlerInput.attributesManager.getSessionAttributes();
		await handlerInput.attributesManager.setPersistentAttributes(attributes.flashCards);
		await handlerInput.attributesManager.savePersistentAttributes();
		console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
		return handlerInput.responseBuilder.getResponse();
	},
};

export default SessionEndedRequestHandler;