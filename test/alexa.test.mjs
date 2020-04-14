import ask from 'ask-sdk-test';
import { handler as skillHandler } from '../lambda/index.mjs';
import { generateResponse } from "./__mock__/nock-got.mjs"

// initialize the testing framework
const skillSettings = {
	appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
	userId: 'amzn1.ask.account.VOID',
	deviceId: 'amzn1.ask.device.VOID',
	locale: 'en-US',
};

const alexaTest = new ask.AlexaTest(skillHandler, skillSettings);

describe('LaunchRequest', () => {
	alexaTest.test([
		{
			request: new ask.LaunchRequestBuilder(skillSettings).build(),
			saysLike: 'Welcome',
			repromptsNothing: false,
			shouldEndSession: false,
			ignoreQuestionCheck: true,
		},
	]);
});

generateResponse("bear", "def1", "def2", "def3")

describe('AddWordIntent', () => {
	alexaTest.test([
		{
			request: new ask.IntentRequestBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").build(),
			saysLike: 'Part(of a person)',
			repromptsLike: 'add',
			shouldEndSession: false,
			ignoreQuestionCheck: true,
			// elicitsSlot: "definitions",
		}
	])
})

// describe('LaunchIntentHandler', () => {
// 	it('should be able to handle requests', () => {
// 		expect(LaunchRequestHandler.canHandle(launchEvent)).to.equal(true);
// 	});
// });