/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */
// IMPORTANT: Please note that this template uses Dispay Directives,
// Display Interface for your skill should be enabled through the Amazon developer console
// See this screenshot - https://alexa.design/enabledisplay

import * as Alexa from 'ask-sdk-core';

import {
  LaunchRequestHandler,
  AddWordHandler,
  HelpHandler,
  ExitHandler,
  RepeatHandler,
  ErrorHandler,
} from './handlers/index.mjs';

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },

};


/* CONSTANTS */
const skillBuilder = Alexa.SkillBuilders.custom();
const speechConsCorrect = ['Booya', 'All righty', 'Bam', 'Bazinga', 'Bingo', 'Boom', 'Bravo', 'Cha Ching', 'Cheers', 'Dynomite', 'Hip hip hooray', 'Hurrah', 'Hurray', 'Huzzah', 'Oh dear.  Just kidding.  Hurray', 'Kaboom', 'Kaching', 'Oh snap', 'Phew', 'Righto', 'Way to go', 'Well done', 'Whee', 'Woo hoo', 'Yay', 'Wowza', 'Yowsa'];
const speechConsWrong = ['Argh', 'Aw man', 'Blarg', 'Blast', 'Boo', 'Bummer', 'Darn', "D'oh", 'Dun dun dun', 'Eek', 'Honk', 'Le sigh', 'Mamma mia', 'Oh boy', 'Oh dear', 'Oof', 'Ouch', 'Ruh roh', 'Shucks', 'Uh oh', 'Wah wah', 'Whoops a daisy', 'Yikes'];

/* LAMBDA SETUP */
exports.handler = skillBuilder
  .withSkillId("amzn1.ask.skill.1")
  .addRequestHandlers(
    LaunchRequestHandler,
    AddWordHandler,
    RepeatHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
