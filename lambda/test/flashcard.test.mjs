import fc from "fast-check";
import chai from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import { randomUnknownWord, getQuestion, checkDeck, createSlotValues } from '../libs/flashcard-helper.mjs';

var expect = chai.expect;


describe("Given an deck based object", () => {
	it("determine if a value is a member of unknown words", () => {
		fc.assert(
			fc.property(
				fc.lorem(10, false), fc.lorem(15, false), fc.lorem(30, false),
				fc.lorem(10, true), fc.lorem(15, true), fc.lorem(30, true),
				(word1, word2, word3, def1, def2, def3) => {
					let sessionObj = {
						words: {
							unknownWords: {
								[word1]: def1, [word2]: def2, [word3]: def3
							}
						}
					};
					expect(checkDeck(sessionObj, word1)).to.be.true;
				}),
			{
				verbose: false,
				numRuns: 20
			}
		)
	});
	it("determine if a value is a member of known words", () => {
		fc.assert(
			fc.property(
				fc.lorem(10, false), fc.lorem(15, false), fc.lorem(30, false),
				fc.lorem(10, true), fc.lorem(15, true), fc.lorem(30, true),
				(word1, word2, word3, def1, def2, def3) => {
					let sessionObj = {
						words: {
							knownWords: {
								[word1]: def1, [word2]: def2, [word3]: def3
							}
						}
					};
					expect(checkDeck(sessionObj, word1)).to.be.true;
				}),
			{
				verbose: false,
				numRuns: 20
			}
		)
	});
	it("determine if a value isn't part of a deck", () => {
		fc.assert(
			fc.property(
				fc.lorem(10, false), fc.lorem(15, false), fc.lorem(30, false),
				fc.lorem(10, true), fc.lorem(15, true), fc.lorem(30, true),
				(word1, word2, word3, def1, def2, def3) => {
					let sessionObj = {
						words: {
							unknownWords: {
								[word1]: def1
							},
							knownWords: {
								[word3]: def3
							}
						}
					};
					expect(checkDeck(sessionObj, '3wjkje')).to.be.false;
				}
			)
		)
	})
});

describe('Given an array', () => {
	it("randomly retrieve elements from the list", () => {
		fc.assert(
			fc.property(
				fc.lorem(10), fc.lorem(15), fc.lorem(30),
				(property1, property2, property3) => {
					let trueArray = [property1, property2, property3];
					let randArray = [property1, property2, property3];
					let [randWord] = randomUnknownWord(randArray);
					expect(randWord).to.not.be.oneOf(randArray);
					expect(randWord).to.be.oneOf(trueArray);
				}
			)
		)
	});
	it("retrieves speech and all definitions from an array", () => {
		fc.assert(
			fc.property(
				fc.lorem(20, false), fc.lorem(10, true),
				fc.lorem(15, true), fc.lorem(20, true), fc.lorem(30, true),
				(word, def1, def2, def3, def4) => {
					let flashcard = { [word]: [[def1, def2], [def3, def4]] };
					let flatArray = [def2, def4];
					let [speech, questWord, definitions, wordlist] = getQuestion(flashcard);
					expect(questWord).to.equal(word);
					expect(definitions).to.deep.equal(flatArray);
					expect(speech).to.equal(`What is the definition of ${word}?`);
				}
			)
		)
	});
	it("builds a slot value object", () => {
		fc.assert(
			fc.property(
				fc.array(fc.lorem(20, true), 1, 10), (valarr) => {
					let randNum = Math.random * valarr.length << 0;
					let val = {
						id: `${randNum}`,
						name: {
							value: valarr[randNum]
						}
					};
					let checkArray = createSlotValues(valarr);
					expect(checkArray[randNum]).to.deep.equal(val);
				})
		)
	})
});