import text from '../libs/handlerhelp.mjs';
import _ from 'lodash';
const noRepeat = text.noRepeat;

const RepeatHandler = {
	canHandle(handlerInput) {
		console.log("Inside RepeatHandler");
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		const request = handlerInput.requestEnvelope.request;

		return request.type === 'IntentRequest' &&
			request.intent.name === 'AMAZON.RepeatHandler';
	},
	handle(handlerInput) {
		console.log("Inside RepeatHandler - handle");
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		const lastSpeech = _.get(attributes, 'lastSpeech');
		if (!lastSpeech) {
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