import ask from 'ask-sdk-test';
import { handler as skillHandler } from '../index.mjs';
import { skillSettings } from "./__mock__/alexa-intents.mjs";

const alexaTest = new ask.AlexaTest(skillHandler, skillSettings).withDynamoDBPersistence('vocab-skill', 'id', 'Vocab_List');

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