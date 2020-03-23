const got = require('got');


function addWord(def_list) {
	try {
	}
	catch 
}

/**
 * 
 * @param {string} word search parameter
 * @param {object} credentials contains id and key for oxford api
 */
async function lookUpWord(word) {
	const app_id = process.env.OXFORD_APP_ID;	// Get this from the Oxford dictionary API webpage
	const app_key = process.env.OXFORD_APP_KEY; // Get this from the Oxford dictionary API webpage
	// determines fields returned strict maching prevents homographs
	const path = "fields=definitions&strictMatch=true";
	// accepts json provides credentials
	const options = {
		hostname: "https://od-api.oxforddictionaries.com",
		port: "443",
		pathname: `/api/v2/entries/en/${word}?${path}`,
		method: "GET",
		header = {
			"Accept": "application/json",
			"app_id": app_id,
			"app_key": app_key,
		},
	};
	// 404 error if word isn't found 400 if wrong fields
	// TODO switch case specific error handling
	try {
		const word_data = await got(options)
	} catch (error) {
		throw "can't find that word"
	}
	return word_data
}