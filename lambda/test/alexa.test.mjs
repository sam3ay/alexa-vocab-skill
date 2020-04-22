import ask from 'ask-sdk-test';
import { handler as skillHandler } from '../index.mjs';
import { generateResponse } from "./__mock__/nock-got.mjs";

// import AWS from 'aws-sdk-mock';
// AWS.mock('DynamoDB', 'putItem', function (params, callback) {
// 	callback(null, "successfully put item in database");
// });
// initialize the testing framework
const skillSettings = {
	appId: 'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
	userId: 'amzn1.ask.account.VOID',
	deviceId: 'amzn1.ask.device.VOID',
	locale: 'en-US',
	debug: true,
};


const alexaTest = new ask.AlexaTest(skillHandler, skillSettings).withDynamoDBPersistence('vocab-skill', 'id', 'Vocab_List');

describe('LaunchRequest', () => {
	alexaTest.test([
		{
			request: new ask.LaunchRequestBuilder(skillSettings).build(),
			saysLike: 'Welcome to',
			repromptsNothing: false,
			shouldEndSession: false,
			ignoreQuestionCheck: true,
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
			saysLike: 'can',
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
	]);
	// Intent Confirmation TODO add confirmation status
	// alexaTest.test([
	// 	{
	// 		request: new ask.IntentRequestBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withSlotResolution('moredef', 'no', 'YesNo', '000').build(),
	// 		intent: { 'confirmationStatus': 'CONFIRMED' },
	// 		saysLike: 'okay',
	// 		shouldEndSession: true,
	// 		ignoreQuestionCheck: true,
	// 		storesAttributes: {
	// 			bear: (value) => {
	// 				return Array.isArray(value)
	// 			},
	// 		}
	// 	}
	// ]);
})

describe('CancelIntent, StopIntent, PauseIntent', () => {
	alexaTest.test([
		{
			request: new ask.IntentRequestBuilder(skillSettings, 'AMAZON.CancelIntent').build(),
			saysLike: 'time',
			repromptsNothing: true,
			shouldEndSession: true,
		},
	]);
	alexaTest.test([
		{
			request: new ask.IntentRequestBuilder(skillSettings, 'AMAZON.StopIntent').build(),
			saysLike: 'time',
			repromptsNothing: true,
			shouldEndSession: true,
		},
	]);
	alexaTest.test([
		{
			request: new ask.IntentRequestBuilder(skillSettings, 'AMAZON.PauseIntent').build(),
			saysLike: 'time',
			repromptsNothing: true,
			shouldEndSession: true,
		},
	]);
});