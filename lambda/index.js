/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */
// IMPORTANT: Please note that this template uses Dispay Directives,
// Display Interface for your skill should be enabled through the Amazon developer console
// See this screenshot - https://alexa.design/enabledisplay

import Alexa from 'ask-sdk';

import {
  LaunchRequestHandler,
  AddWordHandler,
  HelpHandler,
  ExitHandler,
  RepeatHandler,
  ErrorHandler,
  SessionEndedRequestHandler,
} from './handlers/index.mjs';

/* CONSTANTS */
const skillBuilder = Alexa.SkillBuilders.custom();

/* LAMBDA SETUP */
const handler = skillBuilder
  .withPersistenceAdapter(new Alexa.DynamoDbPersistenceAdapter({
    tableName: 'vocab-skill',
    createTable: true,
    attributesName: 'Vocab_List'
  }))
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

export default handler;