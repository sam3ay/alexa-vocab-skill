import _ from 'lodash';
import Alexa from 'ask-sdk';
import { getQuestion, createDirective } from '../libs/flashcard-helper.mjs';

const ReviewHandler = {
	canHandle(handlerInput) {
		console.log("Inside ReviewIntent");
		const requestEnv = handlerInput.requestEnvelope;

		return Alexa.getRequestType(requestEnv) === 'IntentRequest' &&
			Alexa.getIntentName(requestEnv) === 'ReviewIntent';
	},
	async handle(handlerInput) {
		console.log("Inside ReviewIntent- handle");
		const slot = handlerInput.requestEnvelope.request.intent.slots;
		const db_attributes = await handlerInput.attributesManager.getPersistentAttributes();
		let answer = _.get(slot, 'definition');
		console.log(answer)
		const resolutions = 'resolutions.resolutionsPerAuthority[0].values[0].value.id';
		const attributes = await handlerInput.attributesManager.getSessionAttributes();
		// Go through keys and retrieve 10 words
		let lastSpeech = _.get(attributes, 'lastSpeech');
		if (!answer) {
			let [speech, definitions] = getQuestion(_.get(db_attributes, 'words.unknownWords'));
			let updateDefinitionsDirective = createDirective('UPDATE', 'AnyDefinition', 'definition', definitions);
			return handlerInput.responseBuilder
				.speak(speech)
				.reprompt(speech)
				.addDirective(updateDefinitionsDirective)
				.addElicitSlotDirective('definition')
				.getResponse();
		} else if (_.get(answer, resolutions) === '001') {
			attributes.lastSpeech = 'Congrats';
			return handlerInput.responseBuilder
				.speak('Congrats')
				.reprompt('You got it right')
				.addDelegateDirective('ReviewIntent')
				.getResponse();
		}
	},
};

export default ReviewHandler; 