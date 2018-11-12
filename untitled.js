if (audioName) {

  try {

    let aa = await databaseHelper.saveAudioState(deviceID, stream.token, playBackFinished, stream.offsetInMilliseconds, audioName, stream.url);

    console.log("aa in if condn", aa);


    cb = () => {
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

        req.responseBuilder.addDirective(playTemplate).getResponse();;

      } else {
        // have to change this to new sdk
        req.responseBuilder.addAudioPlayerPlayDirective('REPLACE_ALL', stream).getResponse();;
      }

      req.responseBuilder.withStandardCard(
        cardTitle,
        cardText,
        'https://s3.amazonaws.com/goodnight-kiddo-alexa-card-images/rsz_ms_gnk_alexa_skill_small.jpg',
        'https://s3.amazonaws.com/goodnight-kiddo-alexa-card-images/rsz_ms_gnk_alexa_skill_large.jpg'
      ).withShouldEndSession(true).getResponse();;

    }

    return new Promise((resolve) => {
      resolve(cb);
    });

  } catch (e) {

    console.log("e", e);

  }
}