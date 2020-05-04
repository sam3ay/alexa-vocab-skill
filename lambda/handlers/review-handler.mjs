import _ from 'lodash';
import Alexa from 'ask-sdk';
import { getQuestion, createDirective } from '../libs/flashcard-helper.mjs';
import text from '../libs/handlerhelp.mjs';

const StartReviewHandler = {
	async canHandle(handlerInput) {
		console.log("Inside StartReviewIntent");
		const attributes = await handlerInput.attributesManager.getSessionAttributes()
		const requestEnv = handlerInput.requestEnvelope;

		return Alexa.getRequestType(requestEnv) === 'IntentRequest' &&
			Alexa.getIntentName(requestEnv) === 'ReviewIntent' &&
			(Alexa.getDialogState(requestEnv) === 'STARTED');
	},
	async handle(handlerInput) {
		console.log("Inside StartReviewIntent - handle")
		let attributes = await handlerInput.attributesManager.getSessionAttributes()
		let [speech, definitions, word] = getQuestion(_.get(attributes.flashCards, 'words.unknownWords'));
		attributes.word = word
		attributes.definitions = definitions
		let updateDefinitionsDirective = createDirective('UPDATE', 'AnyDefinition', 'definition', definitions);
		// Ask for the definition of a word
		if (Alexa.getDialogState(handlerInput.requestEnvelope) === 'STARTED') {
			attributes.question = speech;
			attributes.lastSpeech = `${text.reviewStart} ${speech}`;
		} else {
			attributes.lastSpeech = speech
		}
		await handlerInput.attributesManager.setSessionAttributes(attributes);
		return handlerInput.responseBuilder
			.speak(attributes.lastSpeech)
			.reprompt(attributes.lastSpeech)
			.addDirective(updateDefinitionsDirective)
			.addElicitSlotDirective('definition')
			.getResponse();
	}
}

const InProgressReviewHandler = {
	canHandle(handlerInput) {
		console.log("Inside InProgressReviewIntent");
		const requestEnv = handlerInput.requestEnvelope;

		return Alexa.getRequestType(requestEnv) === 'IntentRequest' &&
			Alexa.getIntentName(requestEnv) === 'ReviewIntent' &&
			(Alexa.getDialogState(requestEnv) === 'IN_PROGRESS');
	},
	async handle(handlerInput) {
		console.log("Inside ReviewIntent- handle");
		let attributes = await handlerInput.attributesManager.getSessionAttributes()
		const slot = handlerInput.requestEnvelope.request.intent.slots;
		const answer = _.get(slot, 'definition');
		const resolutions = 'resolutions.resolutionsPerAuthority[0].values[0].value.id';
		const idName = parseInt(_.get(answer, resolutions))
		const lastWord = attributes.word
		const lastDef = attributes.definitions
		const [speech, definitions, word] = getQuestion(_.get(attributes.flashCards, 'words.unknownWords'));
		const updateDefinitionsDirective = createDirective('UPDATE', 'AnyDefinition', 'definition', definitions);
		attributes.word = word
		attributes.definitions = definitions
		if (idName >= 1) {
			attributes.lastSpeech = `Congrats, ${lastWord} does mean ${lastDef[idName]}. Next Question. ${speech}`;
		} else {
			attributes.lastSpeech = `Not quite, ${lastWord} means ${lastDef[0]}. Next Question. ${speech}?`;
		}
		await handlerInput.attributesManager.setSessionAttributes(attributes);
		return handlerInput.responseBuilder
			.speak(attributes.lastSpeech)
			.reprompt(attributes.lastSpeech)
			.addDirective(updateDefinitionsDirective)
			.addElicitSlotDirective('definition')
			.getResponse();
	},
};

export { StartReviewHandler, InProgressReviewHandler }; 