import _ from 'lodash';
import Alexa from 'ask-sdk';
import { lookUpWord } from '../libs/word-search.mjs';
import { checkDeck } from '../libs/flashcard-helper.mjs';
import text, { fillSpeech } from '../libs/handlerhelp.mjs';

const helpMessage = text.helpMessage
const addMessage = text.addMessage

const StartedAddWordHandler = {
	async canHandle(handlerInput) {
		console.log("Inside StartedAddWordHandler");
		const attributes = await handlerInput.attributesManager.getSessionAttributes()
		const requestEnv = handlerInput.requestEnvelope;
		return Alexa.getRequestType(requestEnv) === 'IntentRequest' &&
			Alexa.getIntentName(requestEnv) === 'AddWordIntent' &&
			(Alexa.getDialogState(requestEnv) === 'STARTED' || attributes.newWord);
	},
	async handle(handlerInput) {
		console.log("Inside StartedAddWordHandler - handle");
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		const currentIntent = handlerInput.requestEnvelope.request.intent;
		const response = handlerInput.responseBuilder;
		const word = Alexa.getSlotValue(handlerInput.requestEnvelope, 'word')
		// fetch definitions set session attributes
		await handlerInput.attributesManager.setSessionAttributes(attributes);
		// Check if word already exists
		if (checkDeck(attributes.flashCards, word)) {
			delete currentIntent.slots.word.value;
			attributes.newWord = true;
			attributes.lastSpeech = `${word} has already been added. Would you like to add another word?`;
			handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.lastSpeech)
				.reprompt(attributes.lastSpeech)
				.addElicitSlotDirective('word')
				.getResponse();
		} else {
			attributes.word = word
			attributes.definitionList = await lookUpWord(word);
			let [speechMain, speechMore] = fillSpeech(attributes.definitionList, word);
			attributes.speechMain = speechMain;
			attributes.speechMore = speechMore;
			attributes.newWord = false;
		}
		// Check if more definitions are available
		if (attributes.definitionList.length < 1) {
			_.set(currentIntent, 'slots.moredef.value', 'No');
			handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.speechMain)
				.reprompt(attributes.speechMain)
				.addDelegateDirective(currentIntent)
				.getResponse();
		} else {
			handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(`${attributes.speechMain} Would you like to hear more definitions for ${word}?`)
				.reprompt(`Would you like to hear more definitions for ${word}?`)
				.addElicitSlotDirective('moredef')
				.getResponse();
		}
	}
}

/**
 * TODO Add most used definition if add the most popular is spoken
 */
const InProgressAddWordHandler = {
	canHandle(handlerInput) {
		console.log("Inside InProgressAddWordHandler");
		const requestEnv = handlerInput.requestEnvelope;
		return Alexa.getRequestType(requestEnv) === 'IntentRequest' &&
			Alexa.getIntentName(requestEnv) === 'AddWordIntent' &&
			Alexa.getDialogState(requestEnv) === 'IN_PROGRESS';
	},
	async handle(handlerInput) {
		console.log("Inside InProgressAddWordHandler - handle");
		//GRABBING ALL SLOT VALUES AND RETURNING THE MATCHING DATA OBJECT.
		const slot = handlerInput.requestEnvelope.request.intent.slots;
		const currentIntent = handlerInput.requestEnvelope.request.intent;
		const word = Alexa.getSlotValue(handlerInput.requestEnvelope, 'word')
		const more = _.get(slot, 'moredef.resolutions.resolutionsPerAuthority[0].values[0].value.id');
		const response = handlerInput.responseBuilder;
		const attributes = await handlerInput.attributesManager.getSessionAttributes();
		if (more === '001') {
			attributes.lastSpeech = `${attributes.speechMore} ${addMessage} ${word}?`;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.lastSpeech)
				.addDelegateDirective(currentIntent)
				.getResponse();
		} else {
			attributes.lastSpeech = `Okay`;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.lastSpeech)
				.addDelegateDirective(currentIntent)
				.getResponse();
		}
	}
};

const CompletedAddWordHandler = {
	canHandle(handlerInput) {
		console.log("Inside CompletedAddWordHandler");
		const requestEnv = handlerInput.requestEnvelope;
		return Alexa.getRequestType(requestEnv) === 'IntentRequest' &&
			Alexa.getIntentName(requestEnv) === 'AddWordIntent' &&
			Alexa.getDialogState(requestEnv) === 'COMPLETED';
	},

	async handle(handlerInput) {
		const confirm = handlerInput.requestEnvelope.request.intent.confirmationStatus;
		const response = handlerInput.responseBuilder;
		const word = _.get(handlerInput, 'requestEnvelope.request.intent.slots.word.value');
		const attributes = await handlerInput.attributesManager.getSessionAttributes()
		if (confirm === 'CONFIRMED') {
			_.set(attributes.flashCards, `words.unknownWords.${word}`, attributes.definitionList);
			attributes.lastSpeech = `${word} has been added to your vocabulary list.`;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.lastSpeech)
				.getResponse();
		} else {
			attributes.lastSpeech = `Okay, ${word} was not added.`;
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(attributes.lastSpeech)
				.getResponse();
		};
	}
};

export {
	StartedAddWordHandler,
	InProgressAddWordHandler,
	CompletedAddWordHandler
};