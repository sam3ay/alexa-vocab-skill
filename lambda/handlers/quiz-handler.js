const Alexa = require('ask-sdk-core');
const text = require('../libs/text')

const QuizHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		console.log("Inside QuizHandler");
		console.log(JSON.stringify(request));
		return request.type === "IntentRequest" &&
			(request.intent.name === "QuizIntent" || request.intent.name === "AMAZON.StartOverIntent");
	},
	handle(handlerInput) {
		console.log("Inside QuizHandler - handle");
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		const response = handlerInput.responseBuilder;
		attributes.state = states.QUIZ;
		attributes.counter = 0;
		attributes.quizScore = 0;

		var question = askQuestion(handlerInput);
		var speakOutput = startQuizMessage + question;
		var repromptOutput = question;

		const item = attributes.quizItem;
		const property = attributes.quizProperty;

		return response.speak(speakOutput)
			.reprompt(repromptOutput)
			.getResponse();
	},
};

module.exports = QuizHandler;