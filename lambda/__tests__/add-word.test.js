const app = require("..");
const fc = require("fast-check");
//
describe('lookUpWord', () => {
	it("given an invalid word", () => {
		expect(() => lookUpWord("notaword", mock_cred)).toThrowError(/Word/);
	});
});