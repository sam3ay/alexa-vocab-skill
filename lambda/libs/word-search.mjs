import got from "got";
// const ErrorHandler = require("../handlers/errorhandler.js")

/**
	* Searches Oxford dictionary for the definition of a word
	* @param {string} word search parameter
	* @param {object} credentials contains id and key for oxford api
	*/
async function lookUpWord(word) {
	try {
		let app_id = process.env.OXFORD_ID;	// get this from the oxford dictionary api webpage
		let app_key = process.env.OXFORD_KEY; // get this from the oxford dictionary api webpage
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
			},
			retry: 0
		};
		const response = await got("https://od-api.oxforddictionaries.com", options).json();
		// main_def = test_get.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]
		let results = response.results;
		let definitions = retrieveDefinition(results);
		return definitions;
	} catch (error) {
		return "404"
		// return await ErrorHandler(error);
	};
};

/**
 * Extracts information from array of objects 
 * @param {array} response_array Nested array of objects
 * @param {string} metadata Path of metadata in nested array
 * @param {string} identifier Value being searched
 */
function retrieveDefinition(response_array, metadata_path = "lexicalCategory", identifier = "definitions") {
	var definition_list = [];
	function parseResult(response_array, metadata) {
		// Confirm object type
		if (Array.isArray(response_array)) {
			response_array.forEach((item) => {
				// lexicalEntries provides part of speech for all entries attributes
				if (item.hasOwnProperty(metadata_path)) {
					metadata = item[metadata_path].text;
				} else if (item.hasOwnProperty(identifier)) {
					// update definitions array with list of metadata and definition
					definition_list.push([metadata, item[identifier][0]]);
				}
				parseResult(item, metadata);
			})
		} else if (typeof response_array === 'object' && response_array !== null) {
			// If item is a non-null object, (therefore not a primitive)
			// Iterate over properties items # Could be exported
			for (const element in response_array) {
				parseResult(response_array[element], metadata);
			}
		}
	}
	parseResult(response_array);
	return definition_list;
}

export {
	lookUpWord,
	retrieveDefinition
}