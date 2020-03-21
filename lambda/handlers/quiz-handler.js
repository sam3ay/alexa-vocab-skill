const Alexa = require('ask-sdk-core');

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

		if (supportsDisplay(handlerInput)) {
			const title = `Question #${attributes.counter}`;
			const primaryText = new Alexa.RichTextContentHelper().withPrimaryText(getQuestionWithoutOrdinal(property, item)).getTextContent();
			const backgroundImage = new Alexa.ImageHelper().addImageInstance(getBackgroundImage(attributes.quizItem.Abbreviation)).getImage();
			const itemList = [];
			getAndShuffleMultipleChoiceAnswers(attributes.selectedItemIndex, item, property).forEach((x, i) => {
				itemList.push(
					{
						"token": x,
						"textContent": new Alexa.PlainTextContentHelper().withPrimaryText(x).getTextContent(),
					}
				);
			});
			response.addRenderTemplateDirective({
				type: 'ListTemplate1',
				token: 'Question',
				backButton: 'hidden',
				backgroundImage,
				title,
				listItems: itemList,
			});
		}

		return response.speak(speakOutput)
			.reprompt(repromptOutput)
			.getResponse();
	},
};

module.exports = QuizHandler;