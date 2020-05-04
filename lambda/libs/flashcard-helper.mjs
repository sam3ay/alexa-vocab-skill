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
	let [word, definitions] = getFlashcard(flashCards);
	let speech = `What is the definition of ${word}?`;
	return [speech, definitions, word]
}

/**
 * 
 * @param valueArray depth 0 list of strings
 */
function createSlotValues(valueArray) {
	let outArray = []
	for (let i = 0; i < valueArray.length; i++) {
		outArray.push({
			id: `${i}`,
			name: {
				value: valueArray[i]
			}
		})
	}
	return outArray
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
	const directiveValues = createSlotValues(valueArray)
	let directive = {
		type: dialogType,
		updateBehavior: updateType,
		types: [
			{
				name: slotType,
				values: directiveValues
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
	checkDeck,
	createDirective,
	createSlotValues,
	getFlashcard,
	getQuestion,
	randomUnknownWord
}