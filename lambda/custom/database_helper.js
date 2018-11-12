'use strict';
module.change_code = 1;
const goodnightKiddoSkillConfig = require('./goodnightKiddoSkillConfig.json');
const tableName = goodnightKiddoSkillConfig.table_name;
const credentials = {
  accessKeyId: goodnightKiddoSkillConfig.access_key_id,
  secretAccessKey: goodnightKiddoSkillConfig.secret_key_id,
  region: goodnightKiddoSkillConfig.region
};

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient(credentials);

function GoodnightKiddoSkillHelper() {}

// GoodnightKiddoSkillHelper.prototype.saveAudioState = function(deviceId, token, playbackFinished, offset, audioName, url, callback) {
//   const params = {
//     TableName: tableName + '-audio-state',
//     Item: {
//       deviceId: deviceId,
//       token: token,
//       playbackFinished: playbackFinished,
//       offset: offset,
//       audioName: audioName,
//       url: url,
//       sessionTimestamp: new Date()
//     }
//   };

//   docClient.put(params, function(err, data) {
//     if (err) callback(err, null);
//     else callback(err, data);
//   });
// };


GoodnightKiddoSkillHelper.prototype.saveAudioState = function(deviceId, token, playbackFinished, offset, audioName, url) {
  const params = {
    TableName: tableName + '-audio-state',
    Item: {
      deviceId: deviceId,
      token: token,
      playbackFinished: playbackFinished,
      offset: offset,
      audioName: audioName,
      url: url,
      sessionTimestamp: new Date()
    }
  };

  console.log("params", params);

  return new Promise((resolve, reject) => {
    docClient.put(params, function(err, data) {
      console.log("err in db", err);
      if (err) return reject(err);
      else {
        console.log("data in db", data);
        return resolve(data);
      }
    });
  });
};



GoodnightKiddoSkillHelper.prototype.updateAudioState = function(tableData, callback) {
  console.log("inside updateAudioState: ", tableData);
  return docClient.update(tableData, (err, data) => {
    if (err) console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));
    else {
      callback(null, data.Item);
    }
  });
};

GoodnightKiddoSkillHelper.prototype.updateVisitCount = function(deviceId, visitCount, callback) {
  const sessionTimestamp = new Date();
  console.log("session timestamp:", sessionTimestamp);
  const updateVisitCount = {
    TableName: tableName + '-audio-state',
    Key: {
      deviceId: deviceId
    },
    ExpressionAttributeValues: {
      ':visitCount': visitCount,
      ':sessionTimestamp': sessionTimestamp.toString()
    },
    UpdateExpression: 'set visitCount = :visitCount, sessionTimestamp = :sessionTimestamp',
    ReturnValues: 'UPDATED_NEW'
  };
  return docClient.update(updateVisitCount, (err, data) => {
    if (err) console.error('Unable to update visitCount. Error JSON:', JSON.stringify(err, null, 2));
    else {
      callback(null, data.Item);
    }
  });
};

GoodnightKiddoSkillHelper.prototype.updateAudioStateOnEnd = function(deviceId, playbackFinished, listenCount, callback) {
  const updateAudioStateOnEnd = {
    TableName: tableName + '-audio-state',
    Key: {
      deviceId: deviceId
    },
    ExpressionAttributeValues: {
      ':playbackFinished': playbackFinished,
      ':listenCount': listenCount
    },
    UpdateExpression: 'set playbackFinished = :playbackFinished, listenCount= :listenCount',
    ReturnValues: 'UPDATED_NEW'
  };
  return docClient.update(updateAudioStateOnEnd, (err, data) => {
    if (err) console.error('Unable to update item. Error JSON:', JSON.stringify(err, null, 2));
    else {
      callback(null, data.Item);
    }
  });
};

GoodnightKiddoSkillHelper.prototype.readAudioState = function(deviceId, callback) {
  const queryAudioState = {
    TableName: tableName + '-audio-state',
    Key: {
      'deviceId': deviceId
    }
  };
  return docClient.get(queryAudioState, (err, data) => {
    if (err) {
      console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
      callback(err, null);
    } else {
      console.log('data:', data.Item);
      callback(err, data.Item);
    }
  });
};

module.exports = GoodnightKiddoSkillHelper;