import { lookUpWord } from '../libs/word-search.mjs'
import text from '../libs/handlerhelp.mjs';
import _ from 'lodash';

const helpMessage = text.helpMessage
const addMessage = text.addMessage

/**
 * TODO Add most used definition if add the most popular is spoken
 */
const AddWordHandler = {
	canHandle(handlerInput) {
		console.log("Inside AddWordHandler");
		const attributes = handlerInput.attributesManager.getSessionAttributes();
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
		const confirm = handlerInput.requestEnvelope.request.intent.confirmationStatus
		console.log(confirm)
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
		} else if (confirm === 'CONFIRMED') {
			console.log('Inside confirmed')
			let vocabCard = { [word]: attributes.definitionlist }
			await handlerInput.attributesManager.setPersistentAttributes(vocabCard);
			await handlerInput.attributesManager.savePersistentAttributes();
			console.log(attributes)
			handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(`${word} has been added to your vocabulary list.`)
				.getResponse();
		} else if (confirm === 'DENIED') {
			attributes[word] = undefined
			await handlerInput.attributesManager.setSessionAttributes(attributes);
			return response.speak(`Okay then`)
				.getResponse();
		};
		if (more === undefined) {
			// console.log(`${word}, ${more}, ${speechOutput}`)
			return response.speak(attributes.speechMain)
				.reprompt(`Would you like to hear more definitions for ${word}`)
				.addElicitSlotDirective('moredef')
				.getResponse();
		} else if (more === '001') {
			// console.log(`${word}, ${more}, ${speechOutMore}`)
			return response.speak(attributes.speechMore)
				.getResponse();
		} else {
			console.log(handlerInput)
			return response.speak(helpMessage)
				.getResponse();
		}
	}
};

/***
 * TODO Template for interceptor
 */

// const dynamoDbPersistenceAdapter = new DynamoDbPersistenceAdapter({ tableName: 'FooTable' })

// Add definitions based on one per part of speech
function fillSpeech(inputarray, word) {
	let outString = `As a ${inputarray[0][0]}, ${word}, is usually defined as: ${inputarray[0][1]}`;
	let outMoreString = `I have ${(inputarray.length - 1)} more definitions for ${word}:`;
	let partOfSpeech = ""
	for (let i = 1; i < inputarray.length; i++) {
		let part = inputarray[i][0];
		let definition = inputarray[i][1];
		if (part === partOfSpeech) {
			outMoreString += `${i}. ${definition}.`;
		} else {
			partOfSpeech = part
			outMoreString += ` As a ${part}, ${i}. ${definition}.`;
		}
	};
	return [outString, outMoreString];
}

export default AddWordHandler;