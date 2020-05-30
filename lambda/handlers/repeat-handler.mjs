import text from '../libs/handlerhelp.mjs';
import Alexa from 'ask-sdk';
import _ from 'lodash';
const noRepeat = text.noRepeat;

const RepeatHandler = {
	canHandle(handlerInput) {
		console.log("Inside RepeatHandler");
		const requestEnv = handlerInput.requestEnvelope;

		return Alexa.getRequestType(requestEnv) === 'IntentRequest' &&
			Alexa.getIntentName(requestEnv) === 'AMAZON.RepeatHandler';
	},
	handle(handlerInput) {
		console.log("Inside RepeatHandler - handle");
		const slot = handlerInput.requestEnvelope.request.intent.slots;
		let attributes = handlerInput.attributesManager.getSessionAttributes();
		let lastSpeech = _.get(attributes, 'lastSpeech');
		console.log([attributes, lastSpeech, noRepeat])
		if (lastSpeech !== undefined) {
			return handlerInput.responseBuilder
				.speak(lastSpeech)
				.reprompt(lastSpeech)
				.getResponse();
		} else {
			return handlerInput.responseBuilder
				.speak(noRepeat)
				.reprompt(noRepeat)
				.getResponse();
		}
	},
};

export default RepeatHandler; 