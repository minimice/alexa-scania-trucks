// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
var https = require('https');



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const viewportProfile = Alexa.getViewportProfile(handlerInput.requestEnvelope);
        
        if(viewportProfile === "HUB-LANDSCAPE-MEDIUM" || viewportProfile === "HUB-ROUND-SMALL"){
                const speechText = 'Welcome to Scania Trucks, you can ask where your truck is, move your truck, or ask how many trucks you have. Which would you like to try?';
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .addDirective({
                        type: 'Alexa.Presentation.APL.RenderDocument',
                        version: '1.0',
                        document: require('./documents/launchrequest.json'),
                        datasources: {}
                    })
                    .reprompt(speechText)
                    .getResponse();
             } else {
                const speechText = 'Welcome to Scania Trucks, you can ask where your truck is, move your truck, or ask how many trucks you have. Which would you like to try?';
                return handlerInput.responseBuilder
                    .speak(speechText)
                    .reprompt(speechText)
                    .getResponse();
             }
        
    }
};
const MoveTruckIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'MoveTruckIntent';
    },
    handle(handlerInput) {
        
        var truckName = "";
        var truckDest = "";
        
        // Touch event
        if (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent') {
          //itemName = handlerInput.requestEnvelope.request.arguments[0].toLowerCase();
        } else {
            //Voice Intent Request
            const truckNameSlot = handlerInput.requestEnvelope.request.intent.slots.id;
            if (truckNameSlot && truckNameSlot.value) {
                truckName = truckNameSlot.value.toLowerCase();
            }
            const locationSlot = handlerInput.requestEnvelope.request.intent.slots.location;
            if (locationSlot && locationSlot.value) {
                truckDest = locationSlot.value.toLowerCase();
            }
        }
        
        var speechText = 'Okay I will move truck ' + truckName + ' to ' + truckDest;
        
        if (truckName != 'alpha' && truckName != 'beta') {
            speechText = 'You only have two trucks, alpha and beta.  I cannot move a truck you do not have.';
        }
      
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('What would you like to do now?')
            .getResponse();
    }
};
const HowManyTrucksIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HowManyTrucksIntent';
    },
    async handle(handlerInput) {
        
        var truckName = "";
        
        // Touch event
        if (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent') {
          //itemName = handlerInput.requestEnvelope.request.arguments[0].toLowerCase();
        } else {
            //Voice Intent Request
        }
        
        var speechText = 'You have two trucks named alpha and beta.';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('What would you like to do now?')
            .getResponse();
    }
};
const WhereIsMyTruckIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'WhereIsMyTruckIntent';
    },
    async handle(handlerInput) {
        
        var truckName = "";
        
        // Touch event
        if (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent') {
          //itemName = handlerInput.requestEnvelope.request.arguments[0].toLowerCase();
        } else {
            //Voice Intent Request
            const truckNameSlot = handlerInput.requestEnvelope.request.intent.slots.id;
            if (truckNameSlot && truckNameSlot.value) {
                truckName = truckNameSlot.value.toLowerCase();
            }
        }
        
        var speechText = "";
        
        if (truckName != 'alpha' && truckName != 'beta') {
            speechText = 'You only have two trucks, alpha and beta.  I can\'t find truck ' + truckName;
        } else {
           // Make the API call
            const response = await httpGet();
            const theStreet = response.results[0].location.street;
            speechText = 'Truck ' + truckName + ' is somewhere roaming around at ' + theStreet; 
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('What would you like to do now?')
            .getResponse();
    }
};

function httpGet() {
  return new Promise(((resolve, reject) => {
    var options = {
        host: 'api.randomuser.me',
        port: 443,
        path: '/',
        method: 'GET',
    };
    
    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';

      response.on('data', (chunk) => {
        returnData += chunk;
      });

      response.on('end', () => {
        resolve(JSON.parse(returnData));
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
    request.end();
  }));
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        WhereIsMyTruckIntentHandler,
        MoveTruckIntentHandler,
        HowManyTrucksIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
