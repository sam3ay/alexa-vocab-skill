import ask from 'ask-sdk-test';
import _ from 'lodash';
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
const confirmIntent = new ask.IntentRequestBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withSlotResolution('moredef', 'no', 'YesNo', '000').build();
_.set(confirmIntent, 'request.intent.confirmationStatus', 'CONFIRMED');

describe('AddWordIntent', () => {
	describe('Yes to more Definitions', () => {
		alexaTest.test([
			{
				request: new ask.IntentRequestBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withSlotResolution('moredef', 'yes', 'YesNo', '001').build(),
				saysLike: 'more definitions',
				ignoreQuestionCheck: true,
			}
		]);
	});
	// Test no to more definitions
	describe('No to more definitions', () => {
		alexaTest.test([
			{
				request: new ask.IntentRequestBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withSlotResolution('moredef', 'no', 'YesNo', '000').build(),
				saysLike: 'Okay',
			}
		]);
	});
	// Test elicit more definitions
	describe('Elicit more definitions', () => {
		alexaTest.test([
			{
				request: new ask.IntentRequestBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").build(),
				saysLike: 'of a person)',
				shouldEndSession: false,
				elicitsSlot: 'moredef',
				ignoreQuestionCheck: true,
			}
		]);
	})
	describe('Confirm word Added to table', () => {
		alexaTest.test([
			{
				request: confirmIntent,
				saysLike: 'has been added',
				shouldEndSession: true,
				storesAttributes: {
					words: (value) => {
						return _.has(value, 'unknownWords.bear')
					}
				}

			}
		]);
	})
})

describe('ExitHandler', () => {
	describe('CancelIntent', () => {
		alexaTest.test([
			{
				request: new ask.IntentRequestBuilder(skillSettings, 'AMAZON.CancelIntent').build(),
				saysLike: 'time',
				repromptsNothing: true,
				shouldEndSession: true,
			},
		]);
	});
	describe('StopIntent', () => {
		alexaTest.test([
			{
				request: new ask.IntentRequestBuilder(skillSettings, 'AMAZON.StopIntent').build(),
				saysLike: 'time',
				repromptsNothing: true,
				shouldEndSession: true,
			},
		]);
	});
	describe('PauseIntent', () => {
		alexaTest.test([
			{
				request: new ask.IntentRequestBuilder(skillSettings, 'AMAZON.PauseIntent').build(),
				saysLike: 'time',
				repromptsNothing: true,
				shouldEndSession: true,
			},
		]);
	});
});

describe('HelpIntent', () => {
	alexaTest.test([
		{
			request: new ask.IntentRequestBuilder(skillSettings, 'AMAZON.HelpHandler').build(),
			saysLike: ' or',
			repromptsLike: ' or',
			shouldEndSession: false,
			ignoreQuestionCheck: true,
		},
	]);
});


describe('SessionEndIntent', () => {
	alexaTest.test([
		{
			request: new ask.SessionEndedRequestBuilder(skillSettings, 'SessionEndedRequest').build(),
			saysNothing: true,
			repromptsNothing: true,
			shouldEndSession: true,
		},
	]);
});

describe('RepeatIntent', () => {
	describe('Nothing to Repeat', () => {
		alexaTest.test([
			{
				request: new ask.IntentRequestBuilder(skillSettings, 'AMAZON.RepeatHandler').build(),
				saysLike: 'Sorry',
			}
		]);
	})
	describe('Something to repeat', () => {
		alexaTest.test([
			{
				request: new ask.IntentRequestBuilder(skillSettings, 'AMAZON.RepeatHandler').build(),
				saysLike: 'Heya',
				withSessionAttributes: { 'lastSpeech': 'Heya' },
				ignoreQuestionCheck: true,
			}
		])
	})
})