
const LaunchRequestHandler = require('./launch-handler');
const HelpHandler = require('./help-handler');
const ExitHandler = require('./exit-handler');
const RepeatHandler = require('./repeat-handler');
const ErrorHandler = require('./error-handler');
const SessionEndedRequestHandler = require('./session-ended-handler');


const QuizHandler = require('./quiz-handler');
const QuizAnswerHandler = require('./quiz-answer-handler');
const DefinitionHandler = require('./definition-handler');

module.exports = {
	LaunchRequestHandler,
	HelpHandler,
	ExitHandler,
	RepeatHandler,
	ErrorHandler,
	SessionEndedRequestHandler,
	QuizHandler,
	QuizAnswerHandler,
	DefinitionHandler,
};