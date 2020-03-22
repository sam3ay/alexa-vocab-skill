const dictionary = require("oxford=dictionary-api"); jj: w


function addWord(word, credentials) {
	let app_id = credentials.app_id;	// Get this from the Oxford dictionary API webpage
	let app_key = credentials.app_key; // Get this from the Oxford dictionary API webpage
	let dict = new dictionary(app_id, app_key);
	// 404 error if word isn't found 400 if wrong fields
	dict.find(word, (error, definition) => {
		if (error) {
			throw "Can't find that Word";
		} else {
			return definition;
		}
	})
}