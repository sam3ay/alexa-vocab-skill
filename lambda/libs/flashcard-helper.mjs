import _ from 'lodash';


/** Update flashcard with unknown word
 * 
 * @param {object} attributesManager Interface handling session, request and persistence
 */
async function addUnknownFlashcard(attributesManager) {
	let flashcards = await attributesManager.getPersistentAttributes();
	let attributes = await attributesManager.getSessionAttributes();
	if (_.has(flashcards, `words.unknownWords.${attributes.word}`) || _.has(flashcards, `words.knownWords.${attributes.word}`)) {
		return await false;
	} else {
		_.set(flashcards, `words.unknownWords.${attributes.word}`, attributes.definitionList);
		await attributesManager.setPersistentAttributes(flashcards);
		await attributesManager.savePersistentAttributes();
		console.log(JSON.stringify(flashcards, null, 4), JSON.stringify(attributes, null, 4));
		return await true;
	}
};

/**
 * 
 * @param {array} keys array of strings
 */
function randomUnknownWord(keys) {
	// << floor division sub
	return keys[keys.length * Math.random() << 0];
};

/**
 * 
 * @param {object} attributes object with words as strings and definitions as arrays
 */
function getFlashcard(attributes) {
	let keys = Object.keys(attributes);
	let word = randomUnknownWord(keys);
	let definitions = attributes[word].reduce((acc, val) => acc.concat(val[1]), []);
	return [word, definitions];
}

/**
 * 
 * @param {object} attributes object with words as strings and definitions as arrays
 */
function getQuestion(attributes) {
	let [word, definition] = getFlashcard(attributes);
	let speech = `What is the definition of ${word}?`;
	return [speech, definition]
}

/**
 * 
 * @param {string} updateType
 * @param {string} slotType slot to update
 * @param {string} idName slot value identifier 
 * @param {array} valueArray array of "tuples"
 * @param {string} dialogType Directive type
 */
function createDirective(updateType, slotType, idName, valueArray, dialogType = 'Dialog.UpdateDynamicEntities') {
	let directive = {
		type: dialogType,
		updateBehavior: updateType,
		types: [
			{
				name: slotType,
				values: [
					{
						id: idName,
						name: {
							value: valueArray[0],
							synonyms: valueArray.slice(1)
						}
					}
				]
			}
		]
	};
	return directive
}



export {
	addUnknownFlashcard,
	createDirective,
	randomUnknownWord,
	getFlashcard,
	getQuestion
}