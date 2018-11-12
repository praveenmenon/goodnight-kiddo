/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const MeditationModule = require('./lib/MeditationModule');
const RandomModule = require('./lib/RandomInsertsModule');
const AudioModule = require('./audio');
const goodnightKiddoSkillConfig = require('./goodnightKiddoSkillConfig.json');
const tableName = goodnightKiddoSkillConfig.table_name;
const DatabaseHelper = require('./database_helper');
const databaseHelper = new DatabaseHelper();
const EchoShowTemplateModule = require('./echoShowTemplate');
const show = new EchoShowTemplateModule();

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    console.log("handlerInput: ",JSON.stringify(handlerInput));
    const deviceID = handlerInput.requestEnvelope.context.System.device.deviceId;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    console.log('attributes using attributesManager', attributes);
    var prompt, reprompt, random, visitCount, listenCount;


    return new Promise((resolve, reject) => {
      databaseHelper.readAudioState(deviceID, (err, result) => {
        if (err) return reject(err);
        else return resolve(result);
      });
    }).then(function(result) {
      console.log("result from database:", JSON.stringify(result));
      if (result !== undefined && result.playbackFinished == 'true') {
        if (result.sessionTimestamp !== undefined && (new Date().getDate() - new Date(result.sessionTimestamp).getDate()) > 0) {
          visitCount = result.visitCount !== undefined ? result.visitCount++ : 0;
        } else {
          visitCount = 0;
        }

        if (result.listenCount) listenCount = result.listenCount;

        databaseHelper.updateVisitCount(deviceID, visitCount, (err, data) => {
          if (err) {
            console.error('Error in Updated Visit Count and Timestamp', err);
            prompt = 'Oops! There seems to be an error. Please try again later!';
          }
          return handlerInput.responseBuilder.speak(prompt).withShouldEndSession(true).getResponse();
          // return res.say(prompt).shouldEndSession(true).send();
        });

        switch (visitCount) {
          case 5:
          case 10:
          case 15:
          case 20:
          case 25:
          case 30:
          random = RandomModule.frequentUser[Math.floor(Math.random() * RandomModule.frequentUser.length)];
          prompt = "Welcome back to Goodnight Kiddo. Wow, you've been here " + visitCount + " days in a row! You're a " + random + "! Would you like to play Calm, Ocean, Clouds or Flying today?";
          break;

          default:
          prompt = 'Welcome back to Goodnight Kiddo. It\'s time to return to the land of sweet dreams. Would you like to play Calm, Ocean, Clouds or Flying today?';
        }

        if (listenCount) {
          if (listenCount == 10) {
            random = RandomModule.frequentListener[Math.floor(Math.random() * RandomModule.frequentListener.length)];
            prompt = "Welcome back to Goodnight, Kiddo. You've listened to " + listenCount + " meditations so far! You're a " + random + "! Would you like to play Calm, Ocean, Clouds or Flying today?";
          } else if ((listenCount % 25) == 0) {
            random = RandomModule.frequentListener[Math.floor(Math.random() * RandomModule.frequentListener.length)];
            prompt = "Welcome back to Goodnight, Kiddo. You've listened to " + listenCount + " meditations so far! You're a " + random + "! Would you like to play Calm, Ocean, Clouds or Flying today?";
          }
        }

        console.log('result detials:', JSON.stringify((result)));
        var start = RandomModule.error[Math.floor(Math.random() * RandomModule.error.length)];
        reprompt = start + ', I didn\'t catch that. I can help you drift off to sweet dreams. Would you like to listen to Calm, Ocean, Clouds or Flying ?';
        if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display) {
          const template = show.getTemplate('ListTemplate2');
          handlerInput.responseBuilder.addDirective(template);
          // res.response.response.directives = template;
        }
        attributes.cancelSession = 'cancel_true';
        handlerInput.attributesManager.setSessionAttributes(attributes);
        return handlerInput.responseBuilder.speak(prompt).reprompt(reprompt).withShouldEndSession(true).getResponse();
        // return res.say(prompt).reprompt(reprompt).session('cancelSession', 'cancel_true').shouldEndSession(false);
      } else if (result !== undefined && result.playbackFinished == 'false') {

        if (result.sessionTimestamp !== undefined && (new Date().getDate() - new Date(result.sessionTimestamp).getDate()) > 0) {
          visitCount = result.visitCount !== undefined ? result.visitCount++ : 0;
        } else {
          visitCount = 0;
        }

        databaseHelper.updateVisitCount(deviceID, visitCount, (err, data) => {
          if (err) {
            console.error('Error in Updated Visit Count and Timestamp', err);
            prompt = 'Oops! There seems to be an error. Please try again later!';
          }
          return handlerInput.responseBuilder.speak(prompt).withShouldEndSession(true).getResponse();
          // return res.say(prompt).shouldEndSession(true).send();
        });

        var end = RandomModule.launchEnd[Math.floor(Math.random() * RandomModule.launchEnd.length)];
        switch (visitCount) {
          case 5:
          case 10:
          case 15:
          case 20:
          case 25:
          case 30:
          random = RandomModule.frequentUser[Math.floor(Math.random() * RandomModule.frequentUser.length)];
          prompt = "Welcome back to Goodnight Kiddo. Wow, you've been here " + visitCount + " days in a row! You're a " + random + '! You were listening to ' + result.audioName + '. Do you want to ' + end;
          break;

          default:
          random = RandomModule.launch[Math.floor(Math.random() * RandomModule.launch.length)];
          prompt = random + '! You were listening to ' + AudioModule.audioNavigation[result.token].tagline + '. Do you want to ' + end;
        }

        console.log('result detials:', JSON.stringify((result)));
        reprompt = 'You were listening to ' + result.audioName + '. Do you want to ' + end;
        console.log('result:', result);
        if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display) {
          const template = show.getTemplate('BodyTemplate1', result);
          handlerInput.responseBuilder.addDirective(template);
          // res.response.response.directives = template;
        }
        attributes.intentName = 'launchIntent';
        handlerInput.attributesManager.setSessionAttributes(attributes);
        return handlerInput.responseBuilder.speak(prompt).reprompt(reprompt).withShouldEndSession(false).getResponse();
        // return res.say(prompt).reprompt(reprompt).session('intentName', 'launchIntent').shouldEndSession(false);
      } else {
        if (result !== undefined && result.sessionTimestamp !== undefined && (new Date().getDate() - new Date(result.sessionTimestamp).getDate()) > 0) {
          visitCount = result.visitCount !== undefined ? result.visitCount++ : 0;
        } else {
          visitCount = 0;
        }
        databaseHelper.updateVisitCount(deviceID, visitCount, (err, data) => {
          if (err) {
            console.error('Error in Updated Visit Count and Timestamp', err);
            prompt = 'Oops! There seems to be an error. Please try again later!';
          }
          return handlerInput.responseBuilder.speak(prompt).withShouldEndSession(true).getResponse();
          // return res.say(prompt).shouldEndSession(true).send();
        });

        switch (visitCount) {
          case 5:
          case 10:
          case 15:
          case 20:
          case 25:
          case 30:
          random = RandomModule.frequentUser[Math.floor(Math.random() * RandomModule.frequentUser.length)];
          prompt = "Welcome back to Goodnight Kiddo. Wow, you've been here " + visitCount + " days in a row! You're a " + random + "! Would you like to play Calm, Ocean, Clouds or Flying today?";
          break;

          default:
          random = RandomModule.launch[Math.floor(Math.random() * RandomModule.launch.length)];
          prompt = random + '! Welcome to Goodnight Kiddo. Sweet dreams are just around the corner. Would you like to listen to Calm, Ocean, Clouds or Flying ?';
        }

        var start = RandomModule.error[Math.floor(Math.random() * RandomModule.error.length)];
        reprompt = start + ', I didn\'t catch that. I can help you drift off to sweet dreams. Would you like to listen to Calm, Ocean, Clouds or Flying ?';
        if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display) {
          const template = show.getTemplate('ListTemplate2');
          handlerInput.responseBuilder.addDirective(template);
          // res.response.response.directives = template;
        }

        attributes.cancelSession = 'cancel_true';
        handlerInput.attributesManager.setSessionAttributes(attributes);
        return handlerInput.responseBuilder.speak(prompt).reprompt(reprompt).withShouldEndSession(false).getResponse();
        // return res.say(prompt).reprompt(reprompt).session('cancelSession', 'cancel_true').shouldEndSession(false);
      }
    }).catch(function(err) {
      console.log('❌ error during database invocation:', err);
      prompt = 'Sorry, we encountered a problem. Please, try again.';
      return handlerInput.responseBuilder.speak(prompt).withShouldEndSession(true).getResponse();
      // return res.say(prompt).shouldEndSession(true).send();
    });
  },
};

const HelloWorldIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
  },
  handle(handlerInput) {
    const speechText = 'Hello World!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
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
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const MeditationIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'meditationIntent';
  },
  handle(req, error){
    // const response = genericIntentModuleHandler(handlerInput, new MeditationModule());
    // console.log("response in meditation intent:", JSON.stringify(response))
    const module = new MeditationModule();
    var promise = module.intentResponse(req);
    return promise.then(function(results) {
      console.log(" results.cb(req) results:", JSON.stringify(results.cb(req)));
      console.log("results.cb() results:", JSON.stringify(results.cb()));
      return results.cb();
    });
    // return response;
  },
};

const genericIntentModuleHandler = function(req, module) {
  var promise = module.intentResponse(req);
  console.log("promise:", promise);
  return promise.then(function(results) {
    results.cb(req);
  });
};

const YesHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput) {
    var promise = null;
    console.log('In YesHandler');
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const precedingIntentName = sessionAttributes.intentName;
    const imodule = getModuleByIntent(precedingIntentName);


    if (imodule) {
      promise = imodule.yesIntentResponse(handlerInput);
      return promise.then(function(intentResponse) {
        intentResponse.cb(req);
      });
    } else {
      var prompt = 'I did not quite get that. Could you please repeat it?';
      return intentResponse.responseBuilder.speak(prompt).withShouldEndSession(false).getResponse();
    }
  },
};


const getModuleByIntent = function(intentName) {
  var module = null;
  if (intentName === 'meditationIntent') {
    module = new MeditationModule();
  } else if (intentName === 'launchIntent') {
    module = new MeditationModule();
  }
  return module;
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelloWorldIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    MeditationIntent,
    YesHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
