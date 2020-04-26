import _ from 'lodash';


/** Update flashcard with unknown word
 * 
 * @param {object} attributesManager Interface handling session, request and persistence
 */
async function addUnknownFlashcard(attributesManager) {
	let flashcards = await attributesManager.getPersistentAttributes();
	let attributes = await attributesManager.getSessionAttributes();
	if (_.has(flashcards, `word.unknownWords.${attributes.word}`) || _.has(flashcards, `word.knownWords.${attributes.word}`)) {
		return false
	} else {
		_.set(flashcards, `words.unknownWords.${attributes.word}`, attributes.definitionlist);
		await attributesManager.setPersistentAttributes(flashcards);
		await attributesManager.savePersistentAttributes();
		return true
	}
}

export {
	addUnknownFlashcard
}