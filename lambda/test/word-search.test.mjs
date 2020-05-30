import fc from "fast-check";
import chai from 'chai';
import { retrieveDefinition, lookUpWord } from "../libs/word-search.mjs";
import { generateResponse, replyError } from "./__mock__/nock-got.mjs"

var expect = chai.expect

// Component Test, Looking up a word in a dictionary
describe('Word Lookup', () => {
	it("Given an invalid word, return an error(404) message", async () => {
		replyError();
		let searchWord = await lookUpWord("notaword");
		expect(searchWord).to.equal("404");
	});
	// Testing definition retrieval
	it("Given a valid word, retrieve list of nested lists with definitions and part of speech", () => {
		fc.assert(
			fc.property(
				fc.lorem(10, true),
				fc.lorem(15, true),
				fc.lorem(20, true),
				(def1, def2, def3) => {
					let test_results = generateResponse("bear", def1, def2, def3);
					const word_lookup_ans = [['Part', '(of a person) carry'],
					['Part',
						'(of a vehicle or boat) convey (passengers or cargo)'],
					['Part', 'have or display as a visible mark or feature'],
					['Part', 'be called by (a name or title)'],
					['Part', 'carry or conduct oneself in a specified manner'],
					['Part', 'support; carry the weight of'],
					['Part', def1],
					['Part', 'be able to accept or stand up to'],
					['Part', def2],
					['Part', 'manage to tolerate (a situation or experience)'],
					['Part', 'strongly dislike'],
					['Part', 'give birth to (a child)'],
					['Part', '(of a tree or plant) produce (fruit or flowers)'],
					['Part', 'turn and proceed in a specified direction'],
					['Noun',
						'a large, heavy mammal that walks on the soles of its feet, having thick fur and a very short tail. Bears are related to the dog family but most species are omnivorous.'],
					['Noun', 'a teddy bear.'],
					['Noun', 'a nickname for Russia.'],
					['Noun', 'a large, heavy, cumbersome man'],
					['Noun',
						'a gay or bisexual man with a burly physique and a large amount of body hair'],
					['Noun', def3],
					['Noun',
						'something that is very difficult or unpleasant to deal with'],
					['Noun',
						'a person who sells shares hoping to buy them back later at a lower price.']];
					let respond = retrieveDefinition(test_results);
					chai.assert.deepEqual(respond, word_lookup_ans, "Definition parser error");
				}
			),
			{
				verbose: false,
				numRuns: 20
			})
	})
});