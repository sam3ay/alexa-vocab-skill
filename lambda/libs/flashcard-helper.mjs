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
 * TODO rework to include python lambda callout
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
	let [word, semanticDef] = getFlashcard(flashCards);
	let speech = `What is the definition of ${word}?`;
	return [speech, word, semanticDef]
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
};

function testDefinition(answer, definition) {
	if (answer == 'right') {
		return [true, definition[0]];
	} else {
		return [false, definition[1]];
	};
};

function checkDeck(flashCards, word) {
	if (_.has(flashCards, `words.unknownWords.${word}`) || _.has(flashCards, `words.knownWords.${word}`)) {
		return true;
	} else {
		return false;
	};
};


export {
	checkDeck,
	testDefinition,
	createSlotValues,
	getFlashcard,
	getQuestion,
	randomUnknownWord
}