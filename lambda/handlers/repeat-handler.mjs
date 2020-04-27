import text from '../libs/handlerhelp.mjs';
import _ from 'lodash';
const noRepeat = text.noRepeat;

const RepeatHandler = {
	canHandle(handlerInput) {
		console.log("Inside RepeatHandler");
		const request = handlerInput.requestEnvelope.request;

		return request.type === 'IntentRequest' &&
			request.intent.name === 'AMAZON.RepeatHandler';
	},
	handle(handlerInput) {
		console.log("Inside RepeatHandler - handle");
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