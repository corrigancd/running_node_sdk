const fs = require('fs');
const https = require('node:https');

const Openapi = require('../../../temp/javascript/dist/index');
const client = new Openapi.ApiClient('https://localhost:5606/uen'); // update this basepath for dev mode

const {
  parentSavedSearchPayload,
  childSavedSearchPayload,
  parentSavedSearchId,
  childSavedSearchId
} = require('./data');

client.defaultHeaders['kbn-xsrf'] = 'anything';
client.authentications = {
  basicAuth: {
    type: 'basic',
    username: 'sirenserver',
    password: 'password'
  }
}

const options = { 
  ca: fs.readFileSync('/home/edwin/work/kibi-internal/pki/cacert.pem')
}
client.requestAgent = new https.Agent(options);

const api = new Openapi.DefaultApi(client)

const callback = function (error, data, response) {
  console.log('--------------- RESULT OF API CALL -------------------');
  if (error) {
    console.error(error.status, error.message);
  } else {
    console.log('API called successfully with status: ' + response.status + '. Response body: ', response.body);
  }
};


api.createSavedSearch(parentSavedSearchPayload, callback)
api.createSavedSearch(childSavedSearchPayload, callback);

// api.createSavedSearchWithId(parentSavedSearchId, parentSavedSearchPayload, callback)
// api.createSavedSearchWithId(childSavedSearchId, childSavedSearchPayload, callback);
