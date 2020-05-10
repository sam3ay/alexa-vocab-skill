import _ from 'lodash';


/**
 * 
 * @param {array} keys array of strings
 */
function randomUnknownWord(keys) {
	// << floor division sub
	return keys.splice([keys.length * Math.random() << 0], 1);
};

/**
 * TODO rework to include python lambda callout
 * @param {object} flashCards object with words as strings and definitions as arrays
 */
function getFlashcard(flashCards, keys) {
	if (keys === undefined) {
		keys = Object.keys(flashCards);
	};
	let [word] = randomUnknownWord(keys);
	let definitions = flashCards[word].reduce((acc, val) => acc.concat(val[1]), []);
	return [word, definitions, keys];
}

/**
 * 
 * @param {object} flashCards object with words as strings and definitions as arrays
 */
function getQuestion(flashCards, keys = undefined) {
	let [word, semanticDef, wordlist] = getFlashcard(flashCards, keys);
	let speech = `What is the definition of ${word}?`;
	return [speech, word, semanticDef, wordlist]
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