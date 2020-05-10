import _ from 'lodash';
import Alexa from 'ask-sdk';
import { getQuestion, testDefinition } from '../libs/flashcard-helper.mjs';
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
		const [speech, word, semanticDef, wordlist] = getQuestion(_.get(attributes.flashCards, 'words.unknownWords'));
		attributes.word = word;
		attributes.semanticDef = semanticDef
		attributes.wordlist = wordlist
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
		try {
			let attributes = await handlerInput.attributesManager.getSessionAttributes();
			const answer = Alexa.getSlotValue(handlerInput.requestEnvelope, 'definition');
			const lastWord = attributes.word;
			const [isCorrect, lastDef] = testDefinition(answer, attributes.semanticDef);
			const [speech, word, semanticDef, wordlist] = getQuestion(_.get(attributes.flashCards, 'words.unknownWords'), attributes.wordlist);
			attributes.word = word;
			attributes.semanticDef = semanticDef;
			attributes.wordlist = wordlist;
			if (isCorrect) {
				attributes.lastSpeech = `Congrats, ${lastWord} does mean ${lastDef}.`;
			} else {
				attributes.lastSpeech = `Not quite, ${lastWord} means ${lastDef}.`;
			}
			if (wordlist.length === 0) {
				attributes.lastSpeech += ` You've completed your review. Would you like to add additional words or start a review?`
				await handlerInput.attributesManager.setSessionAttributes(attributes);
				return handlerInput.responseBuilder
					.speak(attributes.lastSpeech)
					.getResponse();
			} else {
				attributes.lastSpeech += ` Next Question. ${speech}?`
				await handlerInput.attributesManager.setSessionAttributes(attributes);
				return handlerInput.responseBuilder
					.speak(attributes.lastSpeech)
					.reprompt(attributes.lastSpeech)
					.addElicitSlotDirective('definition')
					.getResponse();
			}
		} catch (e) {
			console.log(e)
		}
	},
};

export { StartReviewHandler, InProgressReviewHandler }; 