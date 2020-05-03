import _ from 'lodash';


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
 * @param {object} flashCards object with words as strings and definitions as arrays
 */
function getFlashcard(flashCards) {
	let keys = Object.keys(flashCards);
	let word = randomUnknownWord(keys);
	let definitions = flashCards[word].reduce((acc, val) => acc.concat(val[1]), []);
	return [word, definitions];
}

/**
 * 
 * @param {object} flashCards object with words as strings and definitions as arrays
 */
function getQuestion(flashCards) {
	let [word, definition] = getFlashcard(flashCards);
	let speech = `What is the definition of ${word}?`;
	return [speech, definition]
}

/**
 * 
 * @param {string} updateType
 * @param {string} slotType slot to update
 * @param {string} idName slot value identifier 
 * @param {array} valueArray values to use to update
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

function checkDeck(flashCards, word) {
	if (_.has(flashCards, `words.unknownWords.${word}`) || _.has(flashCards, `words.knownWords.${word}`)) {
		return true;
	} else {
		return false;
	};
};


export {
	createDirective,
	randomUnknownWord,
	getFlashcard,
	getQuestion,
	checkDeck
}