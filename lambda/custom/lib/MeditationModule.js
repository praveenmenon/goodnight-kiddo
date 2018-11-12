module.change_code = 1;
const AudioModule = require('../audio');
const RandomModule = require('./RandomInsertsModule');
const DatabaseHelper = require('../database_helper');
const SynonymsResolveModule = require('./SynonymsResolveModule');
const databaseHelper = new DatabaseHelper();
const EchoShowTemplateModule = require('../echoShowTemplate');
const show = new EchoShowTemplateModule();

function MeditationModule() {
  this.intentResponse = function(req) {
    const session = req.attributesManager.getSessionAttributes();
    // const intentSession = res.session('intentName');
    const arrayNum = getResolvedValue(req.requestEnvelope, 'arrayNumSlot') || '';
    console.log('arrayNumSlot:', getResolvedValue(req.requestEnvelope, 'arrayNumSlot'));
    const deviceID = req.requestEnvelope.context.System.device.deviceId;
    var response, stream, medNameSlot, cb;

    // if (getResolvedValue(req.requestEnvelope, 'MeditationNameSlot')) medNameSlot = SynonymsResolveModule.extract('MeditationNameSlot', req);
    if (req.requestEnvelope.request.type == 'Display.ElementSelected') medNameSlot = getResolvedValue(req.requestEnvelope, 'MeditationNameSlot');
    console.log('req.slot(MeditationNameSlot):', getResolvedValue(req.requestEnvelope, 'MeditationNameSlot'));
    console.log('req.slot(MeditationName):', getResolvedValue(req.requestEnvelope, 'MeditationName'));
    console.log('Meditation Name', medNameSlot);

    if (session.intentName == 'meditation' || req.requestEnvelope.request.type == 'Display.ElementSelected' || (medNameSlot !== '' || arrayNum !== '') || session.counter == 'true') {
      console.log('✅');

      if (medNameSlot || arrayNum) {
        console.log('Meditation name slot inside if condn.', getResolvedValue(req.requestEnvelope, 'MeditationNameSlot'));
        var calm = session.medTypeSession !== undefined ? session.medTypeSession : 'calm';
        var ocean = session.medTypeSession !== undefined ? session.medTypeSession : 'ocean';
        var clouds = session.medTypeSession !== undefined ? session.medTypeSession : 'clouds';
        var flying = session.medTypeSession !== undefined ? session.medTypeSession : 'flying';

        const selectionCondition = medNameSlot || arrayNum;
        var playBackFinished = 'false';
        var audioName, cardTitle, cardText, nextAudio, prevAudio, backgroundImage;

        console.log('selectionCondition :', selectionCondition);
        console.log('arrayNum :', arrayNum);
        switch (selectionCondition.toLowerCase()) {
          case 'calm':
          case 'first':
          case '1st':
          case '1':
          case 1:
          case 'one':
            response = AudioModule.audioNavigation[calm].tagline;
            cardTitle = AudioModule.audioNavigation[calm].cardTitle;
            cardText = AudioModule.audioNavigation[calm].cardText;
            audioName = AudioModule.audioNavigation[calm].audioName;
            prevAudio = AudioModule.audioNavigation[calm].previous;
            nextAudio = AudioModule.audioNavigation[calm].next;
            backgroundImage = AudioModule.audioNavigation[calm].backgroundImage;
            stream = {
              'url': AudioModule.audioNavigation[calm].url,
              'token': calm,
              'offsetInMilliseconds': 0
            };
            break;

          case 'ocean':
          case 'second':
          case '2nd':
          case '2':
          case 2:
          case 'two':
            response = AudioModule.audioNavigation[ocean].tagline;
            cardTitle = AudioModule.audioNavigation[ocean].cardTitle;
            cardText = AudioModule.audioNavigation[ocean].cardText;
            audioName = AudioModule.audioNavigation[ocean].audioName;
            prevAudio = AudioModule.audioNavigation[ocean].previous;
            nextAudio = AudioModule.audioNavigation[ocean].next;
            backgroundImage = AudioModule.audioNavigation[ocean].backgroundImage;
            stream = {
              'url': AudioModule.audioNavigation[ocean].url,
              'token': ocean,
              'offsetInMilliseconds': 0
            };
            break;

          case 'clouds':
          case 'third':
          case '3rd':
          case '3':
          case 3:
          case 'three':
            response = AudioModule.audioNavigation[clouds].tagline;
            cardTitle = AudioModule.audioNavigation[clouds].cardTitle;
            cardText = AudioModule.audioNavigation[clouds].cardText;
            audioName = AudioModule.audioNavigation[clouds].audioName;
            prevAudio = AudioModule.audioNavigation[clouds].previous;
            nextAudio = AudioModule.audioNavigation[clouds].next;
            backgroundImage = AudioModule.audioNavigation[clouds].backgroundImage;
            stream = {
              'url': AudioModule.audioNavigation[clouds].url,
              'token': 'clouds',
              'offsetInMilliseconds': 0
            };
            break;

          case 'flying':
          case 'fourth':
          case '4th':
          case '4':
          case 4:
          case 'last':
          case 'four':
            response = AudioModule.audioNavigation[flying].tagline;
            cardTitle = AudioModule.audioNavigation[flying].cardTitle;
            cardText = AudioModule.audioNavigation[flying].cardText;
            audioName = AudioModule.audioNavigation[flying].audioName;
            prevAudio = AudioModule.audioNavigation[flying].previous;
            nextAudio = AudioModule.audioNavigation[flying].next;
            backgroundImage = AudioModule.audioNavigation[flying].backgroundImage;
            stream = {
              'url': AudioModule.audioNavigation[flying].url,
              'token': 'flying',
              'offsetInMilliseconds': 0
            };
            break;

          default:
            var prompt = 'I couldn\'t find that meditation. Would you like to listen to calm, ocean, clouds or flying?';
        }
        if (audioName) {
          let promise = new Promise((resolve, reject) => {
            console.log('deviceID', deviceID);
            databaseHelper.saveAudioState(deviceID, stream.token, playBackFinished, stream.offsetInMilliseconds, audioName, stream.url, (err, result) => {
              if (err) return reject(err);
              else return resolve(result);
            });
          });

          return promise.then((successMessage) => {
            cb = function(req) {
              var start;

              if (session.cancelSession) {
                start = 'You\'ve selected';
              } else {
                start = RandomModule.meditationFirst[Math.floor(Math.random() * RandomModule.meditationFirst.length)];
              }

              var end = RandomModule.meditationLast[Math.floor(Math.random() * RandomModule.meditationLast.length)];
              var resp = start + ' ' + response + ' ' + end + ' <break time=\"3.00s\"/>';
              if (req.requestEnvelope.context.System.device.supportedInterfaces.Display) {
                const playTemplate = [{
                  'type': 'AudioPlayer.Play',
                  'playBehavior': 'REPLACE_ALL',
                  'audioItem': {
                    'stream': {
                      'url': stream.url,
                      'token': stream.token,
                      'offsetInMilliseconds': 0
                    },
                    'metadata': {
                      'title': cardTitle,
                      'subtitle': "Goodnight Kiddo",
                      'art': {
                        'sources': [{
                          'url': AudioModule.audioNavigation[stream.token].audioImage
                        }]
                      },
                      'backgroundImage': {
                        'sources': [{
                          'url': AudioModule.audioNavigation[stream.token].backgroundImage
                        }]
                      }
                    }
                  }
                }];
                req.responseBuilder.addDirective(playTemplate);
              } else {
                // have to change this to new sdk
                req.responseBuilder.addAudioPlayerPlayDirective('REPLACE_ALL', stream);
              }
              req.responseBuilder.withStandardCard(
                cardTitle,
                cardText,
                'https://s3.amazonaws.com/goodnight-kiddo-alexa-card-images/rsz_ms_gnk_alexa_skill_small.jpg',
                'https://s3.amazonaws.com/goodnight-kiddo-alexa-card-images/rsz_ms_gnk_alexa_skill_large.jpg'
              ).withShouldEndSession(true);
            };
            return new Promise((resolve) => {
              resolve({
                prompt,
                cb
              });
            });
          });
        } else {
          console.log(prompt);
          cb = function(req) {
            req.responseBuilder.speak(prompt).reprompt(prompt).withShouldEndSession(false).getResponse();
          };
        }
      } else {
        var start = RandomModule.error[Math.floor(Math.random() * RandomModule.error.length)];
        response = start + ', I didn\'t catch that. I can help you drift off to sweet dreams. Would you like to listen to Calm, Ocean, Clouds or Flying ?';
        console.log(response);
        cb = function(req) {
          req.responseBuilder.speak(response).reprompt(response).withShouldEndSession(false).getResponse();
        };
      }
    } else if (req.requestEnvelope.request.intent.name == 'meditationIntent') {
      var start = RandomModule.error[Math.floor(Math.random() * RandomModule.error.length)];
      response = start + ', I didn\'t catch that. I can help you drift off to sweet dreams. Would you like to listen to Calm, Ocean, Clouds or Flying ?';
      console.log(response);
      attributes.intentName = 'meditation';
      attributes.cancelSession = 'cancel_true';
      cb = function(req) {
        req.responseBuilder.speak(response).reprompt(response).withShouldEndSession(false);
      };
    } else {
      response = 'I currently do not have any information regarding that.';
      cb = function(req) {
        req.responseBuilder.speak(response).withShouldEndSession(false);
      };
    }

    return new Promise((resolve) => {
      // console.log("callback:", cb);
      // console.log("prompt:", response);
      resolve({
        response,
        cb
      });
    });

  };

  this.yesIntentResponse = function(req) {
    var prompt, cb;

    const deviceID = req.requestEnvelope.context.System.device.deviceId;
    let promise = new Promise((resolve, reject) => {
      databaseHelper.readAudioState(deviceID, (err, result) => {
        if (err) return reject(err);
        else return resolve(result);
      });
    });

    return promise.then((successMessage) => {
      cb = function(req) {
        console.log(successMessage.audioName);
        const stream = {
          'url': successMessage.url,
          'token': successMessage.token,
          'offsetInMilliseconds': successMessage.offset
        };
        console.log('stream', stream);
        if (req.requestEnvelope.context.System.device.supportedInterfaces.Display) {
          const playTemplate = [{
            'type': 'AudioPlayer.Play',
            'playBehavior': 'REPLACE_ALL',
            'audioItem': {
              'stream': {
                'url': stream.url,
                'token': stream.token,
                'offsetInMilliseconds': successMessage.offset
              },
              'metadata': {
                'title': AudioModule.audioNavigation[stream.token].cardTitle,
                'subtitle': "Goodnight Kiddo",
                'art': {
                  'sources': [{
                    'url': AudioModule.audioNavigation[stream.token].audioImage
                  }]
                },
                'backgroundImage': {
                  'sources': [{
                    'url': AudioModule.audioNavigation[stream.token].backgroundImage
                  }]
                }
              }
            }
          }];
          req.responseBuilder.addDirective(playTemplate);
        } else {
          req.responseBuilder.addAudioPlayerPlayDirective('REPLACE_ALL', stream);
        }
        var end = RandomModule.meditationLast[Math.floor(Math.random() * RandomModule.meditationLast.length)];
        var response = 'Resuming ' + AudioModule.audioNavigation[stream.token].cardTitle + end;
        req.responseBuilder.say(response).shouldEndSession(true);
      };
      return new Promise((resolve) => {
        resolve({
          prompt,
          cb
        });
      });
    });
  };

  this.noIntentResponse = function(req, res) {
    var prompt, cb;

    const deviceID = req.data.context.System.device.deviceId;
    const playBackFinished = 'true';
    let promise = new Promise((resolve, reject) => {
      databaseHelper.updateAudioStateOnEnd(deviceID, playBackFinished, (err, result) => {
        if (err) return reject(err);
        else return resolve(result);
      });
    });

    return promise.then((successMessage) => {
      cb = function(res) {
        console.log('request', req.data.request);
        console.log('context', req.data.context);
        const random = RandomModule.stop[Math.floor(Math.random() * RandomModule.stop.length)];
        if (req.data.context.System.device.supportedInterfaces.Display) {
          const template = show.getTemplate('ListTemplate2');
          res.response.response.directives = template;
        }
        prompt = random + '! Would you like to listen to Calm, Ocean, Clouds or Flying today?';
        res.say(prompt).session('cancelSession', 'cancel_true').shouldEndSession(false);
      };
      return new Promise((resolve) => {
        resolve({
          prompt,
          cb
        });
      });
    });
  };

  function getResolvedValue(requestEnvelope, slotName) {
    if (requestEnvelope &&
      requestEnvelope.request &&
      requestEnvelope.request.intent &&
      requestEnvelope.request.intent.slots &&
      requestEnvelope.request.intent.slots[slotName] &&
      requestEnvelope.request.intent.slots[slotName].resolutions &&
      requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority &&
      requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0] &&
      requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values &&
      requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0]
      .values[0] &&
      requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0]
      .value &&
      requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0]
      .value.name) {
      return requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }
    return undefined;
  }
}
module.exports = MeditationModule;