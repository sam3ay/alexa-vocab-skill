import ask from 'ask-sdk-test';
import { handler as skillHandler } from '../index.mjs';
import { generateResponse } from "./__mock__/nock-got.mjs";
import { IntentBuilder, skillSettings } from "./__mock__/alexa-intents.mjs";

generateResponse("bear", "definition 1", "definition 2", "definition 3");
const alexaTest = new ask.AlexaTest(skillHandler, skillSettings).withDynamoDBPersistence('vocab-skill', 'id', 'Vocab_List');


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