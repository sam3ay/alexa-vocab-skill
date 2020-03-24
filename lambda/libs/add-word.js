const got = require("got");

function addWord(def_list) {
	try {
	}
	catch {
	}
}

/**
	* 
	* @param {string} word search parameter
	* @param {object} credentials contains id and key for oxford api
	*/
async function lookUpWord(word) {
	let app_id = process.env.oxford_app_id;	// get this from the oxford dictionary api webpage
	let app_key = process.env.oxford_app_key; // get this from the oxford dictionary api webpage
	// determines fields returned strict maching prevents homographs
	const path = "fields=definitions&strictmatch=true";
	// accepts json provides credentials
	const options = {
		host: 'od-api.oxforddictionaries.com',
		path: `/api/v2/entries/en-gb/${word}?fields=definitions&strictMatch=True`,
		method: "GET",
		headers: {
			'app_id': app_id,
			'app_key': app_key,
		}
	};
	try {
		let response = await got("https://od-api.oxforddictionaries.com", options).json();
		console.log(await response);
		// main_def = test_get.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]
		let definitions = retrieveDefinition(response)
	} catch (error) {
		Errorhandler(error)
	}
};