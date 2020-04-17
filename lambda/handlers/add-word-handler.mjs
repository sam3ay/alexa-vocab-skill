import { lookUpWord } from '../libs/word-search.mjs'
import text from '../libs/handlerhelp.mjs';
import _ from 'lodash';
// import DynamoDbPersistenceAdapter from "ask-sdk-dynamodb-persistence-adapter"

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
		const response = handlerInput.responseBuilder;
		const attributes = handlerInput.attributesManager.getSessionAttributes();

		// fetch definitions
		attributes.definitionlist = await lookUpWord(word);
		let [speechOutput, speechOutMore] = fillSpeech(attributes.definitionlist, word);
		handlerInput.attributesManager.setSessionAttributes(attributes);
		if (more === undefined) {
			// console.log(`${word}, ${more}, ${speechOutput}`)
			return response.speak(speechOutput)
				.reprompt(`Would you like to hear more definitions for ${word}`)
				.addElicitSlotDirective('moredef')
				.getResponse();
		} else if (more === '001') {
			// console.log(`${word}, ${more}, ${speechOutMore}`)
			return response.speak(speechOutMore)
				.getResponse();
		} else {
			// console.log("okay")
			return response.speak("okay")
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
	let outString = `As a ${inputarray[0][0]}, ${word}, is ussually defined as: ${inputarray[0][1]}`;
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