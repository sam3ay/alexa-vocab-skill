import * as Alexa from 'ask-sdk-core';
import lookUpWord from '../libs/word-search'
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
		const word = handlerInput.requestEnvelope.request.intent.slots.word.value;
		const response = handlerInput.responseBuilder;
		const attributes = handlerInput.attributesManager.getSessionAttributes();

		// new word fetch definition
		if (word != attributes.word) {
			attributes.definitionlist = await lookUpWord(word);
			attributes.first = 0
			attributes.last = 4
			attributes.word = word
			attributes.setSessionAttributes(attributes)
		}
		if (attributes.first >= len("attributes.definitionlist")) {
			return response.speak("Too long")
				.reprompt("You know")
				.getResponse();
		} else {
			let [speechOutput, slotDirective] = fillSlotObjects(attributes.definitions, attributes.first, attributes.last)
			attributes.first += 4
			attributes.last += 4
			attributes.setSessionAttributes(attributes)
			return response.speak(speechOutput)
				.reprompt("Nothing")
				.getResponse();
			// add slot values and request the slot
			// .addDirective(slotDirective)
			//.addElicitSlotDirective('definition')
		}
	}
};

/***
 * TODO Template for interceptor
 */
const PersistenceSavingResponseInterceptor = {
	process(handlerInput) {
		return new Promise((resolve, reject) => {
			handlerInput.attributesManager.savePersistentAttributes()
				.then(() => {
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	}
};

// Add definitions 4 at a time to slot and check answer against them
function fillSlotObjects(inputarray, first, last) {
	let outString = ``;
	let replaceEntityDirective = {
		type: 'Dialog.UpdateDynamicEntities',
		update: 'REPLACE',
		types: []
	};
	for (let i = first; i < last || i < len(inputarray); i++) {
		let definition = inputarray[i][0] + inputarray[i][1];
		let entity = {
			id: `def${i}`,
			name: {
				value: definition,
			}
		};
		outString += definition;
		replaceEntityDirective.types.push(entity);
	};
}

export { AddWordHandler };