import ask from 'ask-sdk-test';
import { handler as skillHandler } from '../index.mjs';

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
