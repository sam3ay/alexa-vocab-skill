const text = {
	addMessage: "Would you like to add",
	exitSkillMessage: "Ok, till next time.",
	helpMessage: "Would you like to add a word or start a review?",
	newWelcomeMessage: "Welcome to Vocab skill.",
	noRepeat: "Sorry, Would you like to add a word or start a review?",
	NoWord: "Sorry,",
	reviewStart: "",
	wordExist: "",
	welcomeMessage: "Welcome back to Vocab skill"
};

/**
 * 
 * @param {list} inputarray list of strings
 * @param {string} word subject of sentences
 */
function fillSpeech(inputarray, word) {
	let outString = `As a ${inputarray[0][0]}, ${word}, is usually defined as: ${inputarray[0][1]}`;
	let outMoreString = `I have ${(inputarray.length - 1)} more definitions for ${word}:`;
	let partOfSpeech = "";
	for (let i = 1; i < inputarray.length; i++) {
		let part = inputarray[i][0];
		let definition = inputarray[i][1];
		// switch sentence category
		if (part === partOfSpeech) {
			outMoreString += ` ${i}. ${definition}.`;
		} else {
			partOfSpeech = part;
			outMoreString += ` As a ${part}, ${i}. ${definition}.`;
		};
	};
	return [outString, outMoreString];
};

function checkDeck(flashCards, word) {
	if (_.has(flashCards, 'words.unknownWords') || _.has(flashCards, 'words.knownWords')) {
		return true;
	} else {
		return false;
	};
};

export default text;
export {
	fillSpeech,
	checkDeck
}