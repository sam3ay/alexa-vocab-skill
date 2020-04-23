import text from '../libs/handlerhelp.mjs';
import _ from 'lodash';
const noRepeat = text.noRepeat;

const QuizHandler = {
	canHandle(handlerInput) {
		console.log("Inside RepeatHandler");
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		const request = handlerInput.requestEnvelope.request;

		return request.type === 'IntentRequest' &&
			request.intent.name === 'QuizIntent';
	},
	async handle(handlerInput) {
		console.log("Inside RepeatHandler - handle");
		db_attributes = await handlerInput.attributesManager.getPersistentAttributes();
		// Go through keys and retrieve 10 words
		wordList = getQuestion(db_attributes)
		const lastSpeech = _.get(attributes, 'lastSpeech');
		return handlerInput.responseBuilder
			.speak(noRepeat)
			.reprompt(noRepeat)
			.getResponse();
	},
};

export default QuizHandler; 