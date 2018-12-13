// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const https = require('https');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const viewportProfile = Alexa.getViewportProfile(handlerInput.requestEnvelope);
        const speechText = 'Welcome to Scania Trucks, you can ask where your truck is, move your truck, or ask how many trucks you have. Which would you like to try?';
        
        if (viewportProfile === "HUB-LANDSCAPE-MEDIUM" || viewportProfile === "HUB-ROUND-SMALL") {
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
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const MoveTruckIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'MoveTruckIntent';
    },
    async handle(handlerInput) {
        
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
        
        var speechText = 'Okay I will move truck ' + truckName;// + ' to ' + truckDest;
        
        // https://cuddly-baboon-77.localtunnel.me/api/action?vehicleId=1000&toLat=63.798221&toLong=20.227907
        
        if (truckName !== 'alpha' && truckName !== 'beta' && truckName !== 'charlie') {
            speechText = 'You only three trucks named alpha, beta, and charlie.  I cannot move a truck you do not have.';
        } else {
           // Make the API call
           var vehicleId = '1000';
           var lat = '';
           var lng = '';
           
           if (truckName === 'beta') {
               vehicleId = '1001';
           } else if (truckName === 'charlie') {
               vehicleId = '1002';
           }
           
           if (truckDest === 'stockholm') {
                // 59.344755, 18.054850
                lat = '59.344755';
                lng = '18.054850';
                speechText = 'Okay I will move ' + truckName + ' to ' + truckDest;
                console.log(speechText);
           } else if (truckDest === 'gothenburg') {
                lat = '57.7010496'; // 57.7010496,11.6136596
                lng = '11.6136596';
                speechText = 'Okay I will move ' + truckName + ' to ' + truckDest;
                console.log(speechText);
           } else { // if (truckDest === 'kalix' || truckDest === 'kallix') {
                lat = '65.8585681'; // 57.7010496,11.6136596
                lng = '23.1217093';
                speechText = 'Okay I will move ' + truckName + ' to kalix';
                console.log(speechText);                
           } /*else if (truckDest === 'kiruna') {
                lat = '67.850166'; // 67.850166, 20.218540
                lng = '20.218540';
                speechText = 'Okay I will move ' + truckName + ' to ' + truckDest;
                console.log(speechText);
           }*/
           
           if (lat === '' || lng === '') {
                speechText = 'I do not understand your destination, you can only use stockholm, gothenburg, and kalix.';
                console.log(speechText);
           } else {
                const response = await postDestination(vehicleId,lat,lng);
           }         
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
        
        //var speechText = 'You have one truck named alpha.';
        var speechText = 'You have three trucks named alpha, beta, and charlie.';
        
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
        
        if (truckName !== 'alpha' && truckName !== 'beta' && truckName !== 'charlie') {
            speechText = 'You only have three trucks, alpha, beta, and charlie.  I can\'t find truck ' + truckName;
            console.log("You asked for " + truckName);
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

function postDestination(vehicleId, lat, lng) {
    // http://localhost:5000/api/action?vehicleId=1000&toLat=63.798221&toLong=20.227907
  return new Promise(((resolve, reject) => {
    var options = {
        host: 'scaniahack.localtunnel.me',
        port: 443,
        path: '/api/action?vehicleId='+vehicleId+'&toLat='+lat+'&toLong='+lng,
        method: 'GET',
    };
    
    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';

      response.on('data', (chunk) => {
        returnData += chunk;
      });

      response.on('end', () => {
        resolve();//JSON.parse(returnData));
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
    request.end();
  }));
}

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
