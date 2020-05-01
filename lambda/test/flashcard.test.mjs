import fc from "fast-check";
import chai from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import { addUnknownFlashcard, randomUnknownWord, getQuestion } from '../libs/flashcard-helper.mjs';

var expect = chai.expect;


describe("Given an deck based object", () => {
	it("determine if a value is a member of unknown words", () => {
		fc.assert(
			fc.asyncProperty(
				fc.lorem(10, false), fc.lorem(15, false), fc.lorem(30, false),
				fc.lorem(10, true), fc.lorem(15, true), fc.lorem(30, true),
				async (word1, word2, word3, def1, def2, def3) => {
					let sessionObj = {
						words: {
							unknownWords: {
								[word1]: def1, [word2]: def2, [word3]: def3
							}
						}
					}
					let attrWord = { word: word1 }
					let attributeManager = {
						setSessionAttributes: async () => { return await true },
						setPersistentAttributes: async () => { return await true },
						savePersistentAttributes: async () => { return await true },
						getSessionAttributes: async () => {
							return await attrWord;
						},
						getPersistentAttributes: async () => {
							return await sessionObj;
						},
					};
					expect(await addUnknownFlashcard(attributeManager)).to.be.false;
				}),
			{
				verbose: false,
				numRuns: 20
			}
		)
	});
	it("determine if a value is a member of known words", () => {
		fc.assert(
			fc.asyncProperty(
				fc.lorem(10, false), fc.lorem(15, false), fc.lorem(30, false),
				fc.lorem(10, true), fc.lorem(15, true), fc.lorem(30, true),
				async (word1, word2, word3, def1, def2, def3) => {
					let sessionObj = {
						words: {
							knownWords: {
								[word1]: def1, [word2]: def2, [word3]: def3
							}
						}
					};
					let attrWord = { word: word1 }
					let attributeManager = {
						setSessionAttributes: async () => { return await true },
						setPersistentAttributes: async () => { return await true },
						savePersistentAttributes: async () => { return await true },
						getSessionAttributes: async () => {
							return await attrWord;
						},
						getPersistentAttributes: async () => {
							return await sessionObj;
						},
					};
					expect(await addUnknownFlashcard(attributeManager)).to.be.false;
				}),
			{
				verbose: false,
				numRuns: 20
			}
		)
	});
	it("adds a word to unknown words", () => {
		fc.assert(
			fc.asyncProperty(
				fc.lorem(10, false), fc.lorem(15, false), fc.lorem(30, false),
				fc.lorem(10, true), fc.lorem(15, true), fc.lorem(30, true),
				async (word1, word2, word3, def1, def2, def3) => {
					let sessionObj = {
						words: {
							unknownWords: {
								[word1]: def1, [word3]: def3
							}
						}
					};
					let attrWord = { word: word2, definitionList: def2 }
					let attributeManager = {
						setSessionAttributes: async () => { return await true },
						setPersistentAttributes: async () => { return await true },
						savePersistentAttributes: async () => { return await true },
						getSessionAttributes: async () => {
							return await attrWord;
						},
						getPersistentAttributes: async () => {
							return await sessionObj;
						},
					};
					let attrPost = await addUnknownFlashcard(attributeManager)
					expect(attrPost).to.be.true
					expect(sessionObj).to.have.deep.nested.property(`words.unknownWords.${word2}`, def2);
				}),
			{
				verbose: false,
				numRuns: 20
			}
		)
	});
});

describe('Given an array', () => {
	it("randomly retrieve elements from the list", () => {
		fc.assert(
			fc.property(
				fc.lorem(10), fc.lorem(15), fc.lorem(30),
				(property1, property2, property3) => {
					let randArray = [property1, property2, property3];
					expect(randomUnknownWord(randArray)).to.be.oneOf(randArray);
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
					let flatArray = [def2, def4]
					let [speech, definitions] = getQuestion(flashcard)
					expect(definitions).to.deep.equal(flatArray);
					expect(speech).to.equal(`What is the definition of ${word}?`);
				}
			)
		)
	});
});