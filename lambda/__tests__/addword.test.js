const main = require("../index");
const fc = require("fast-check");
//
describe('addWordToList', () => {
	it("given an invalid word", () => {
		expect(() => addword("notaword")).toThrowError(NotWord);
	});
});