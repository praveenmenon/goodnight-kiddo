'use strict';
module.change_code = 1;
const AudioModule = require('./audio');
const RandomModule = require('./lib/RandomInsertsModule');

function EchoShowDisplayTemplates() {}

EchoShowDisplayTemplates.prototype.getTemplate = function(type, params) {
  var d = {};

  switch (type) {

    case 'BodyTemplate1':
      d = [{
        'type': 'Display.RenderTemplate',
        'template': {
          'type': 'BodyTemplate1',
          'token': params.token,
          'backButton': 'VISIBLE',
          'backgroundImage': {
            'contentDescription': 'Background Image',
            'sources': [{
              'url': AudioModule.audioNavigation[params.token].backgroundImage
            }]
          },
          'title': 'Would you like to resume',
          'textContent': {
            'primaryText': {
              'text': AudioModule.audioNavigation[params.token].tagline.replace('.', '?'),
              'type': 'PlainText'
            }
          }
        }
      }];
      break;

    case 'BodyTemplate2':
      d = [{
        'type': 'BodyTemplate2',
        'title': params.title,
        'token': 'T123',
        'backButton': 'VISIBLE',
        'backgroundImage': {
          'contentDescription': 'Background Image',
          'sources': [{
            'url': 'https://s3.amazonaws.com/qwinix-echo/rsz_rsz_img-backer-03_resized.png'
          }],
          'image': {
            'contentDescription': 'Community Event',
            'sources': [{
              'url': params.listImageUrl[0]
            }]
          },
          'textContent': {
            'primaryText': {
              'text': params.primaryText[0],
              'type': 'PlainText'
            },
            'secondaryText': {
              'text': params.secondaryText[0],
              'type': 'PlainText'
            },
            'tertiaryText': {
              'text': '',
              'type': ''
            }
          }
        }
      }, {
        "type": "Hint",
        "hint": {
          "type": "PlainText",
          "text": RandomModule.displayHint[Math.floor(Math.random() * RandomModule.displayHint.length)]
        }
      }];
      break;

    case 'ListTemplate1':
      d = [{
        'type': 'Display.RenderTemplate',
        'template': {
          'type': 'ListTemplate1',
          'token': 'listToken1',
          'title': 'Meditations',
          'backButton': 'VISIBLE',
          'backgroundImage': {
            'contentDescription': 'Background Image',
            'sources': [{
              'url': 'https://s3.amazonaws.com/goodnight-kiddo-alexa/GNK_croped_background_image.png'
            }]
          },
          'listItems': [{
            'token': 'Calm',
            'textContent': {
              'primaryText': {
                'text': 'Calm',
                'type': 'PlainText'
              },
              'secondaryText': {
                'text': 'A five minute meditation by Franko Heke.',
                'type': 'PlainText'
              }
            }
          }, {
            'token': 'Ocean',
            'textContent': {
              'primaryText': {
                'text': 'Ocean',
                'type': 'PlainText'
              },
              'secondaryText': {
                'text': 'A five minute meditation by Franko Heke.',
                'type': 'PlainText'
              }
            }
          }, {
            'token': 'Clouds',
            'textContent': {
              'primaryText': {
                'text': 'Clouds',
                'type': 'PlainText'
              },
              'secondaryText': {
                'text': 'A four minute meditation by Faith Hunter.',
                'type': 'PlainText'
              }
            }
          }, {
            'token': 'Flying',
            'textContent': {
              'primaryText': {
                'text': 'Flying',
                'type': 'PlainText'
              },
              'secondaryText': {
                'text': 'A four minute meditation by Julie Campilio.',
                'type': 'PlainText'
              }
            }
          }]
        }
      }];
      break;

    case 'ListTemplate2':
      d = [{
        'type': 'Display.RenderTemplate',
        'template': {
          'type': 'ListTemplate2',
          'token': 'listToken1',
          'title': 'Goodnight Kiddo',
          'backButton': 'VISIBLE',
          'backgroundImage': {
            'contentDescription': 'Background Image',
            'sources': [{
              'url': 'https://s3.amazonaws.com/goodnight-kiddo-alexa/images/MS_Alexa_Skill_Goodnight_Kiddo_Default_EchoShow_ListTemplate2_BG.png'
            }]
          },
          'listItems': [{
            'token': 'Calm',
            'image': {
              'sources': [{
                'url': 'https://s3.amazonaws.com/goodnight-kiddo-alexa/images/MS_Alexa_Skill_Goodnight_Kiddo_Calm_EchoShow_ListTemplate2.png'
              }],
              'contentDescription': 'Calm'
            },
            'textContent': {
              'primaryText': {
                'text': 'Calm',
                'type': 'PlainText'
              },
              'secondaryText': {
                'text': 'A five minute meditation',
                'type': 'PlainText'
              }
            }
          }, {
            'token': 'Ocean',
            'image': {
              'sources': [{
                'url': 'https://s3.amazonaws.com/goodnight-kiddo-alexa/images/MS_Alexa_Skill_Goodnight_Kiddo_Ocean_EchoShow_ListTemplate2.png'
              }],
              'contentDescription': 'Ocean'
            },
            'textContent': {
              'primaryText': {
                'text': 'Ocean',
                'type': 'PlainText'
              },
              'secondaryText': {
                'text': 'A five minute meditation',
                'type': 'PlainText'
              }
            }
          }, {
            'token': 'Clouds',
            'image': {
              'sources': [{
                'url': 'https://s3.amazonaws.com/goodnight-kiddo-alexa/images/MS_Alexa_Skill_Goodnight_Kiddo_Clouds_EchoShow_ListTemplate2.png'
              }],
              'contentDescription': 'Clouds'
            },
            'textContent': {
              'primaryText': {
                'text': 'Clouds',
                'type': 'PlainText'
              },
              'secondaryText': {
                'text': 'A four minute meditation',
                'type': 'PlainText'
              }
            }
          }, {
            'token': 'Flying',
            'image': {
              'sources': [{
                'url': 'https://s3.amazonaws.com/goodnight-kiddo-alexa/images/MS_Alexa_Skill_Goodnight_Kiddo_Flying_EchoShow_ListTemplate2.png'
              }],
              'contentDescription': 'Flying'
            },
            'textContent': {
              'primaryText': {
                'text': 'Flying',
                'type': 'PlainText'
              },
              'secondaryText': {
                'text': 'A four minute meditation',
                'type': 'PlainText'
              }
            }
          }]
        }
      }, {
        "type": "Hint",
        "hint": {
          "type": "PlainText",
          "text": RandomModule.displayHint[Math.floor(Math.random() * RandomModule.displayHint.length)]
        }
      }];
      break;
  }
  return d;
};


EchoShowDisplayTemplates.prototype.getParams = function(title, token, listImages, primaryText, secondaryText) {
  var d = {};
  d = {
    'title': title,
    'token': token,
    'backgroundImageUrl': '',
    'imageUrl': '',
    'listImageUrl': listImages,
    'primaryText': primaryText,
    'secondaryText': secondaryText,
    'tertiaryText': '',
  };

  return d;
};

module.exports = EchoShowDisplayTemplates;