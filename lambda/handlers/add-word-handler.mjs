import _ from 'lodash';
import Alexa from 'ask-sdk';
import { lookUpWord } from '../libs/word-search.mjs';
import { addUnknownFlashcard } from '../libs/flashcard-helper.mjs';
import text, { fillSpeech } from '../libs/handlerhelp.mjs';

const helpMessage = text.helpMessage
const addMessage = text.addMessage

/**
 * TODO Add most used definition if add the most popular is spoken
 */
const AddWordHandler = {
	canHandle(handlerInput) {
		console.log("Inside AddWordHandler");
		const requestEnv = handlerInput.requestEnvelope;
		return Alexa.getRequestType(requestEnv) === 'IntentRequest' &&
			Alexa.getIntentName(requestEnv) === 'AddWordIntent';
	},
	async handle(handlerInput) {
		console.log("Inside AddWordHandler - handle");
		//GRABBING ALL SLOT VALUES AND RETURNING THE MATCHING DATA OBJECT.
		const slot = handlerInput.requestEnvelope.request.intent.slots;
		// const word = _.get(slot, 'word.value');
		let word = Alexa.getSlotValue(handlerInput.requestEnvelope, 'word')
		const more = _.get(slot, 'moredef.resolutions.resolutionsPerAuthority[0].values[0].value.id');
		const confirm = handlerInput.requestEnvelope.request.intent.confirmationStatus;
		const response = handlerInput.responseBuilder;
		const attributes = await handlerInput.attributesManager.getSessionAttributes();
		// fetch definitions set session attributes
		if (attributes.word !== word) {
			attributes.word = word
			attributes.definitionList = await lookUpWord(word);
			let [speechMain, speechMore] = fillSpeech(attributes.definitionList, word);
			attributes.speechMain = speechMain;
			attributes.speechMore = speechMore;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
		}
		if (confirm === 'CONFIRMED') {
			let newWord = await addUnknownFlashcard(handlerInput.attributesManager);
			if (newWord) {
				attributes.lastSpeech = `${word} has been added to your vocabulary list.`;
			} else {
				attributes.lastSpeech = `${word} is already in your vocabulary list.`;
			}
			attributes.word = undefined;
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
				.reprompt(`Would you like to hear more definitions for ${word}?`)
				.addElicitSlotDirective('moredef')
				.getResponse();
		} else if (more === '001') {
			// console.log(`${word}, ${more}, ${speechOutMore}`)
			attributes.lastSpeech = `${attributes.speechMore} ${addMessage} ${word}?`;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.lastSpeech)
				.getResponse();
		} else if (more === '000') {
			// console.log(`${word}, ${more}, ${speechOutMore}`)
			attributes.lastSpeech = `Okay`;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.lastSpeech)
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