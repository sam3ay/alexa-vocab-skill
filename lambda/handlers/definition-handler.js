const Alexa = require('ask-sdk-core');

const DefinitionHandler = {
	canHandle(handlerInput) {
		console.log("Inside DefinitionHandler");
		const attributes = handlerInput.attributesManager.getSessionAttributes();
		const request = handlerInput.requestEnvelope.request;

		return attributes.state !== states.QUIZ &&
			request.type === 'IntentRequest' &&
			request.intent.name === 'AnswerIntent';
	},
	handle(handlerInput) {
		console.log("Inside DefinitionHandler - handle");
		//GRABBING ALL SLOT VALUES AND RETURNING THE MATCHING DATA OBJECT.
		const item = getItem(handlerInput.requestEnvelope.request.intent.slots);
		const response = handlerInput.responseBuilder;

		//IF THE DATA WAS FOUND
		if (item && item[Object.getOwnPropertyNames(data[0])[0]] !== undefined) {
			if (useCardsFlag) {
				response.withStandardCard(
					getCardTitle(item),
					getTextDescription(item),
					getSmallImage(item),
					getLargeImage(item))
			}

			if (supportsDisplay(handlerInput)) {
				const image = new Alexa.ImageHelper().addImageInstance(getLargeImage(item)).getImage();
				const title = getCardTitle(item);
				const primaryText = new Alexa.RichTextContentHelper().withPrimaryText(getTextDescription(item, "<br/>")).getTextContent();
				response.addRenderTemplateDirective({
					type: 'BodyTemplate2',
					backButton: 'visible',
					image,
					title,
					textContent: primaryText,
				});
			}
			return response.speak(getSpeechDescription(item))
				.reprompt(repromptSpeech)
				.getResponse();
		}
		//IF THE DATA WAS NOT FOUND
		else {
			return response.speak(getBadAnswer(item))
				.reprompt(getBadAnswer(item))
				.getResponse();
		}
	}
};

module.exports = DefinitionHandler;