const app = require("..");
const fc = require("fast-check");
//
describe('Word Lookup', () => {
	it("Given an invalid word, return an error(404) message", async () => {
		expect.assertions(1);
		error_msg = await add_word.lookUpWord("notaword");
		expect(error_msg).toEqual("/404/")
	});
	it("Given a valid word, retrieve list of nested lists with definitions and part of speech", async () => {
		expect.assertions(1);
		// mock and fast-check for rigorous testing
		let definitions = await add_word.retrieveDefinition(mockjson);
		expect(definitions).toEqual([]);
	});
});