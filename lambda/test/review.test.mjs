
import ask from 'ask-sdk-test';
import sinon from 'sinon';
import { handler as skillHandler } from '../index.mjs';
import { IntentBuilder, skillSettings } from "./__mock__/alexa-intents.mjs";
import sagemaker from '@aws-sdk/client-sagemaker-runtime';

var stub = sinon.stub(sagemaker.SageMakerRuntime.prototype, 'invokeEndpoint').returns(0);
const alexaTest = new ask.AlexaTest(skillHandler, skillSettings).withDynamoDBPersistence('vocab-skill', 'id', 'Vocab_List');

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
        before(() => {
            stub.returns({
                predict: 1,
                sentence: 'where'
            })
        });
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
                                bear: ['multidef', 'moredef'],
                                right: ['multidef', 'moredef']
                            }
                        }
                    }
                },
                elicitsSlot: 'definition'
            }
        ]);
    });
    describe('Incorrect Answer', () => {
        before(() => {
            stub.returns({
                predict: 0,
                sentence: 'Nope'
            })
        });
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
                                bear: ['multidef', 'moredef'],
                                right: ['multidef', 'moredef']
                            }
                        }
                    }
                },
                elicitsSlot: 'definition'
            }
        ]);
    });
    describe('Correct Answer, No more word', () => {
        before(() => {
            stub.returns({
                predict: 1,
                sentence: 'Heya'
            })
        });
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
                }
            }
        ]);
    });
})