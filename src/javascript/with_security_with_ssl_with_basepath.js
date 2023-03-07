const fs = require('fs');
const https = require('node:https');

const Openapi = require('../../../temp/javascript/dist/index');
const client = new Openapi.ApiClient('https://localhost:5606/rvg'); // update this basepath for dev mode

const {
  parentSavedSearchPayload,
  childSavedSearchPayload
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
    console.error(error.status, error.message, response.body.message);
  } else {
    console.log('API called successfully with status: ' + response.status + '. Response body: ', response.body);
  }
};

api.createSavedSearchWithId(parentSavedSearchPayload.params.id, parentSavedSearchPayload, callback)
api.createSavedSearchWithId(childSavedSearchPayload.params.id, childSavedSearchPayload, callback);
