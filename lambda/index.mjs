/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */
// IMPORTANT: Please note that this template uses Dispay Directives,
// Display Interface for your skill should be enabled through the Amazon developer console
// See this screenshot - https://alexa.design/enabledisplay

import Alexa from 'ask-sdk';

import {
  StartedAddWordHandler,
  StartReviewHandler,
  InProgressAddWordHandler,
  InProgressReviewHandler,
  CompletedAddWordHandler,
  ErrorHandler,
  ExitHandler,
  HelpHandler,
  LaunchRequestHandler,
  RepeatHandler,
  SessionEndedRequestHandler,
} from './handlers/index.mjs';

/* CONSTANTS */
const skillBuilder = Alexa.SkillBuilders.custom();

/* LAMBDA SETUP */
const handler = skillBuilder
  .withSkillId(process.env.AMZN_APP_ID)
  .withPersistenceAdapter(new Alexa.DynamoDbPersistenceAdapter({
    tableName: 'vocab-skill',
    // createTable: true,
    attributesName: 'Vocab_List'
  }))
  .addRequestHandlers(
    LaunchRequestHandler,
    StartedAddWordHandler,
    StartReviewHandler,
    InProgressAddWordHandler,
    InProgressReviewHandler,
    CompletedAddWordHandler,
    RepeatHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

export { handler };