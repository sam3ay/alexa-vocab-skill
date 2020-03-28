const got = require("got");
const ErrorHandler = require("../handler/errorhandler.js")

/**
	* Searches Oxford dictionary for the definition of a word
	* @param {string} word search parameter
	* @param {object} credentials contains id and key for oxford api
	*/
function lookUpWord(word) {
	try {
		results = searchWord(word)
		definitions = retrieveDefinition(results);
		return definitions;
	} catch (error) {
		return ErrorHandler(error);
	};
};

/**
 * Returns an array of objects containing information about the word
 * @param {string} word word to find in dictionary
 */
async function searchWord(word) {
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
		},
	};
	try {
		let response = await got("https://od-api.oxforddictionaries.com", options).json();
		// main_def = test_get.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]
		results = response.results;
		return results
	} catch {
		return ErrorHandler(error);
	}
}
/**
 * Extracts information from array of objects 
 * @param {array} response_array Nested array of objects
 * @param {string} metadata Path of metadata in nested array
 * @param {string} identifier Value being searched
 */
function retrieveDefinition(response_array, metadata_path = "lexicalCategory", identifier = "definitions") {
	var definition_list = []
	function parseResult(response_array, metadata) {
		// Confirm object type
		try {
			response_array.forEach((item) => {
				// lexicalEntries provides part of speech for all entries attributes
				if (item[metadata_path]) {
					metadata = item[metadata_path].text
				} else if (item[identifier]) {
					// update definitions array with list of metadata and definition
					definition_list.push([metadata, item[identifier][0]]);
				}
				if (typeof item === 'object' && item !== null) {
					// If item is a non-null object, (therefore not a primitive)
					// Iterate over properties items # Could be exported
					for (element in item) {
						parseResult(item[element], metadata)
					}
				}
				parseResult(item, metadata);
			})
		} catch (error) {
			if (error == "TypeError") {
				// Primitive/null encountered
			}
		}
	}
	try {
		parseResult(response_array)
		return definition_list
	} catch (error) {
		console.log(error)
		return ErrorHandler(error)
	}
}
