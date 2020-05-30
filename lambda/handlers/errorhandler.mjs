import text from '../libs/handlerhelp.mjs';
const helpMessage = text.helpMessage

const ErrorHandler = {
	canHandle() {
		console.log("Inside ErrorHandler");
		return true;
	},
	handle(handlerInput, error) {
		console.log("Inside ErrorHandler - handle");
		console.log(`Error handled: ${JSON.stringify(error)}`);
		console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);

		return handlerInput.responseBuilder
			.speak(helpMessage)
			.reprompt(helpMessage)
			.getResponse();
	},
};

export default ErrorHandler;