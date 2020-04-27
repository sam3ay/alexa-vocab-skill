import fc from "fast-check";
import chai from 'chai';
import { randomUnknownFlashcard } from '../libs/flashcard-helper.mjs'

var expect = chai.expect

describe("Given a list", () => {
	it("randomly retrieve elements from the list", () => {
		fc.assert(
			fc.property(
				fc.lorem(10), fc.lorem(15), fc.lorem(30),
				(property1, property2, property3) => {
					let randArray = [property1, property2, property3];
					expect(randomUnknownFlashcard(randArray)).to.be.oneOf(randArray);
				}
			)
		)
	});
	it("determine if a value is a member", () => {
		fc.assert(
			fc.property(
				fc.lorem(10), fc.lorem(15), fc.lorem(30),
				fc.lorem(10), fc.lorem(15), fc.lorem(30),
				(word1, word2, word3, word4, word5, word6) => {
					let randArray = [word1, word2, word3, word4, word5, word6]
					expect(addWord(word1)).to.be.false;
				}
			)
		)
	})
});