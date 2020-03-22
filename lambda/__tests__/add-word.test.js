const app = require("..");
const fc = require("fast-check");
//
describe('addWordToList', () => {
	it("given an invalid word", () => {
		expect(() => addword("notaword")).toThrowError(/Word/);
	});
});