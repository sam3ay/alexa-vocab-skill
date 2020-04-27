import text from '../libs/handlerhelp.mjs';
import _ from 'lodash';
const noRepeat = text.noRepeat;

const ReviewHandler = {
	canHandle(handlerInput) {
		console.log("Inside ReviewIntent");
		const request = handlerInput.requestEnvelope.request;

		return request.type === 'IntentRequest' &&
			request.intent.name === 'ReviewIntent';
	},
	async handle(handlerInput) {
		console.log("Inside ReviewIntent- handle");
		db_attributes = await handlerInput.attributesManager.getPersistentAttributes();
		// Go through keys and retrieve 10 words
		let wordList = getQuestion(db_attributes)
		let lastSpeech = _.get(attributes, 'lastSpeech');
		return handlerInput.responseBuilder
			.speak(noRepeat)
			.reprompt(noRepeat)
			.getResponse();
	},
};

export default ReviewHandler; 