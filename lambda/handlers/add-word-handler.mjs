import { lookUpWord } from '../libs/word-search.mjs';
import { addUnknownFlashcard } from '../libs/flashcard-helper.mjs';
import text, { fillSpeech } from '../libs/handlerhelp.mjs';
import _ from 'lodash';

const helpMessage = text.helpMessage
const addMessage = text.addMessage

/**
 * TODO Add most used definition if add the most popular is spoken
 */
const AddWordHandler = {
	canHandle(handlerInput) {
		console.log("Inside AddWordHandler");
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' &&
			request.intent.name === 'AddWordIntent';
	},
	async handle(handlerInput) {
		console.log("Inside AddWordHandler - handle");
		//GRABBING ALL SLOT VALUES AND RETURNING THE MATCHING DATA OBJECT.
		const slot = handlerInput.requestEnvelope.request.intent.slots;
		const word = _.get(slot, 'word.value');
		const more = _.get(slot, 'moredef.resolutions.resolutionsPerAuthority[0].values[0].value.id');
		const confirm = handlerInput.requestEnvelope.request.intent.confirmationStatus;
		const response = handlerInput.responseBuilder;
		const attributes = await handlerInput.attributesManager.getSessionAttributes();
		// fetch definitions set session attributes
		if (attributes.word !== word) {
			attributes.word = word
			attributes.definitionlist = await lookUpWord(word);
			let [speechMain, speechMore] = fillSpeech(attributes.definitionlist, word);
			attributes.speechMain = speechMain;
			attributes.speechMore = speechMore;
			handlerInput.attributesManager.setSessionAttributes(attributes);
		}
		if (confirm === 'CONFIRMED') {
			console.log('Okay now what')
			await addUnknownFlashcard(handlerInput.attributesManager);
			attributes.word = undefined;
			attributes.lastSpeech = `${word} has been added to your vocabulary list.`;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.lastSpeech)
				.getResponse();
		} else if (confirm === 'DENIED') {
			attributes.word = undefined;
			attributes.lastSpeech = `Okay then`;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.lastSpeech)
				.getResponse();
		};
		if (more === undefined) {
			// console.log(`${word}, ${more}, ${speechOutput}`)
			attributes.lastSpeech = attributes.speechMain;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.speechMain)
				.reprompt(`Would you like to hear more definitions for ${word}`)
				.addElicitSlotDirective('moredef')
				.getResponse();
		} else if (more === '001') {
			// console.log(`${word}, ${more}, ${speechOutMore}`)
			attributes.lastSpeech = attributes.speechMore;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.speechMore)
				.getResponse();
		} else {
			attributes.lastSpeech = helpMessage;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(helpMessage)
				.getResponse();
		}
	}
};

// Add definitions based on one per part of speech

export default AddWordHandler;