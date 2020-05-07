import ask from 'ask-sdk-test';
import _ from 'lodash';
import v4 from 'uuid';
import { handler as skillHandler } from '../index.mjs';
import { generateResponse, dynamoTable } from "./__mock__/nock-got.mjs";

// import AWS from 'aws-sdk-mock';
// AWS.mock('DynamoDB', 'putItem', function (params, callback) {
// 	callback(null, "successfully put item in database");
// });
// initialize the testing framework
/**
 * Class representing an Intent request from Alexa
 */
// TODO Check for intent dialog delegate 
class IntentBuilder extends ask.IntentRequestBuilder {
	/**
	 * 
	 * @param {object} settings Object containing skill settings
	 * @param {string} intentName Name of intent Alexa will send
	 */
	constructor(settings, intentName) {
		super(settings, intentName);
	};
	withDialogState(dialogState) {
		this.dialogState = dialogState;
		return this
	};
	withConfirmationStatus(confirmState) {
		this.confirmState = confirmState;
		return this;
	};
	buildRequest() {
		return {
			type: 'IntentRequest',
			requestId: `EdwRequestId.${v4()}`,
			timestamp: new Date().toISOString(),
			locale: this.settings.locale,
			intent: {
				name: this.intentName,
				slots: this.slots,
				confirmationStatus: this.confirmState,
			},
			dialogState: this.dialogState,
		};
	};
};

const skillSettings = {
	appId: process.env.AMZN_APP_ID,
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

// Add Word In Progress more def

describe('AddWordIntent', () => {
	describe('Yes to more Definitions', () => {
		alexaTest.test([
			{
				request: new IntentBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withSlotResolution('moredef', 'yes', 'YesNo', '001').withDialogState("IN_PROGRESS").build(),
				saysLike: 'more definitions',
				ignoreQuestionCheck: true,
				withSessionAttributes: { 'speechMore': 'more definitions' },
			}
		]);
	});
	describe('No to more definitions', () => {
		alexaTest.test([
			{
				request: new IntentBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withDialogState("IN_PROGRESS").build(),
				saysLike: 'Okay',
			}
		]);
	});
	// Test elicit more definitions
	describe('Elicit more definitions', () => {
		alexaTest.test([
			{
				request: new IntentBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withDialogState("STARTED").build(),
				saysLike: 'of a person)',
				withSessionAttributes: {
					flashCards: {
					}
				},
				shouldEndSession: false,
				elicitsSlot: 'moredef',
				ignoreQuestionCheck: true,
			}
		]);
	});
	describe('If word Already exists', () => {
		alexaTest.test([
			{
				request: new IntentBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withDialogState("STARTED").build(),
				saysLike: 'has already been added',
				shouldEndSession: false,
				elicitsSlot: 'word',
				withSessionAttributes: {
					flashCards: {
						words: {
							unknownWords: {
								bear: ['multidef', 'moredef']
							}
						}
					}
				}
			}
		]);
	});
	describe('Confirm word Added to table', () => {
		alexaTest.test([
			{
				request: new IntentBuilder(skillSettings, "AddWordIntent").withSlot("word", "bear").withSlotResolution('moredef', 'yes', 'YesNo', '001').withConfirmationStatus('CONFIRMED').withDialogState('COMPLETED').build(),
				saysLike: 'has been added',
				shouldEndSession: true,
				withSessionAttributes: {
					flashCards: {
					},
					word: 'bear',
					definitionList: ['here']
				},
				hasAttributes: {
					flashCards: {
						words: {
							unknownWords: {
								bear: ['here']
							}
						}
					}
				}
			},
		]);
	})
});

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
				withSessionAttributes: {
					flashCards: {
						words: {
							unknownWords: {
								bear: ['multidef', 'moredef']
							}
						}
					},
					storesAttributes: {
						words: {
							unknownWords: {
								bear: ['multidef', 'moredef']
							}
						}
					}
				},
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
			withSessionAttributes: {
				flashCards: {
					words: {
						unknownWords: {
							bear: ['multidef', 'moredef']
						}
					}
				},
				storesAttributes: {
					words: {
						unknownWords: {
							bear: ['multidef', 'moredef']
						}
					}
				}
			},
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
		]);
	});
});


describe('ReviewIntent', () => {
	describe('Ask question on launch', () => {
		alexaTest.test([
			{
				request: new IntentBuilder(skillSettings, 'ReviewIntent').withDialogState('STARTED').build(),
				saysLike: 'What is the definition',
				withSessionAttributes: {
					flashCards: {
						words: {
							unknownWords: {
								bear: ['multidef', 'moredef']
							}
						}
					}
				},
				elicitsSlot: 'definition',
			}
		]);
	});
	describe('Correct Answer', () => {
		alexaTest.test([
			{
				request: new IntentBuilder(skillSettings, 'ReviewIntent').withSlot('definition', 'right').withDialogState("IN_PROGRESS").build(),
				saysLike: 'Congrats',
				withSessionAttributes: {
					semanticDef: ['Heya', 'more', 'where'],
					word: 'test',
					flashCards: {
						words: {
							unknownWords: {
								bear: ['multidef', 'moredef']
							}
						}
					}
				},
				elicitsSlot: 'definition'
			}
		]);
	});
	describe('Incorrect Answer', () => {
		alexaTest.test([
			{
				request: new IntentBuilder(skillSettings, 'ReviewIntent').withSlot('definition', 'wrong').withDialogState("IN_PROGRESS").build(),
				saysLike: 'Not quite',
				withSessionAttributes: {
					semanticDef: ['Heya', 'more', 'where'],
					word: 'test',
					flashCards: {
						words: {
							unknownWords: {
								bear: ['multidef', 'moredef']
							}
						}
					}
				},
				elicitsSlot: 'definition'
			}
		]);
	});
})