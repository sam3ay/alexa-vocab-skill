import Alexa from 'ask-sdk';

const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		console.log("Inside SessionEndedRequestHandler");
		return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
		return handlerInput.responseBuilder.getResponse();
	},
};

export default SessionEndedRequestHandler;