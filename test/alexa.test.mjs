import ask from 'ask-sdk-test';
import { handler as skillHandler } from '../lambda/index.mjs';
import { generateResponse } from "./__mock__/nock-got.mjs";

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
			ignoreQuestionCheck: true
		},
	]);
});

generateResponse("bear", "definition 1", "definition 2", "definition 3");

describe('AddWordIntent', () => {
	// Test yes to more definitions
	alexaTest.test([
		{
			request: new ask.IntentRequestBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withSlotResolution('moredef', 'no', 'YesNo', '001').build(),
			saysLike: 'more definitions',
			shouldEndSession: true,
			ignoreQuestionCheck: true,
		}
	]);
	// Test no to more definitions
	alexaTest.test([
		{
			request: new ask.IntentRequestBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withSlotResolution('moredef', 'no', 'YesNo', '000').build(),
			saysLike: 'okay',
			shouldEndSession: true,
			ignoreQuestionCheck: true,
		}
	]);
	// Test elicit more definitions
	alexaTest.test([
		{
			request: new ask.IntentRequestBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").build(),
			saysLike: 'of a person)',
			shouldEndSession: false,
			ignoreQuestionCheck: true,
			elicitsSlot: 'moredef',
		}
	])
})