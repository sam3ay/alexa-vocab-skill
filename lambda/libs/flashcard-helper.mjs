import _ from 'lodash';
import sagemaker from '@aws-sdk/client-sagemaker-runtime'

/**
 * 
 * @param {array} keys array of strings
 */
function randomUnknownWord(keys) {
    // << floor division sub
    return keys.splice([keys.length * Math.random() << 0], 1);
};

/**
 * TODO rework to include python lambda callout
 * @param {object} flashCards object with words as strings and definitions as arrays
 */
function getFlashcard(flashCards, keys) {
    if (keys === undefined) {
        keys = Object.keys(flashCards);
    };
    let [word] = randomUnknownWord(keys);
    let definitions = flashCards[word].reduce((acc, val) => acc.concat(val[1]), []);
    return [word, definitions, keys];
}

/**
 * 
 * @param {object} flashCards object with words as strings and definitions as arrays
 */
function getQuestion(flashCards, keys = undefined) {
    let [word, semanticDef, wordlist] = getFlashcard(flashCards, keys);
    let speech = `What is the definition of ${word}?`;
    return [speech, word, semanticDef, wordlist];
}

/**
 * 
 * @param valueArray depth 0 list of strings
 */
function createSlotValues(valueArray) {
    let outArray = []
    for (let i = 0; i < valueArray.length; i++) {
        outArray.push({
            id: `${i}`,
            name: {
                value: valueArray[i]
            }
        });
    };
    return outArray
};

async function testDefinition(answer, definition) {
    let endpointName = process.env.ENDPOINT_NAME;	// get this from the oxford dictionary api webpage
    let body = JSON.stringify({
        query: [answer],
        corpus: definition
    });
    let params = {
        EndpointName: endpointName,
        Body: body,
        ContentType: 'application/json',
        Accept: 'application/json'
    };
    const client = new sagemaker.SageMakerRuntime();
    client.middlewareStack.add(
        (next, context) => args => {
            args.request.headers["Custom-Header"] = "value";
            console.log("\n -- printed from inside middleware -- \n");
            console.log(args)
            return next(args);
        },
        {
            step: "build"
        }
    );
    let response = await client.invokeEndpoint(params);
    return response;
};

function checkDeck(flashCards, word) {
    if (_.has(flashCards, `words.unknownWords.${word}`) || _.has(flashCards, `words.knownWords.${word}`)) {
        return true;
    } else {
        return false;
    };
};


export {
    checkDeck,
    testDefinition,
    createSlotValues,
    getFlashcard,
    getQuestion,
    randomUnknownWord
}