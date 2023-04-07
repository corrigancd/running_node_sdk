const fs = require('fs');
const https = require('node:https');

const Openapi = require('../../../temp/javascript/dist/index');
const client = new Openapi.ApiClient('https://localhost:5606/ylx'); // update this basepath for dev mode

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

const api = new Openapi.ApiVersionV1Api(client)

const callback = function (error, data, response) {
  console.log('--------------- RESULT OF API CALL -------------------');
  if (error) {
    console.error(error.status, error.message);
  } else {
    console.log('API called successfully with status: ' + response.status + '. Response body: ', response.body);
  }
};

const type = 'search';

const callbackForValidate = function (error, data, response) {
  console.log('--------------- RESULT OF VALIDATE API CALL -------------------');
  if (error) {
    console.error(response.error.status, response.error.text);
  } else if (response.body.warning) {
    console.log('API validated the ' + type + ' object successfully with status: ' + response.status + '. But there was a warning: "' + response.body.warning + '"');
  } else {
    console.log('API validated the ' + type + ' object successfully with status: ' + response.status + '. Response body: ', response.body);
  }
};

// here we can specify an id, which is required for parent id in order to link it to the child search
// api.updateInvestigateObject(type, parentSavedSearchId, parentSavedSearchPayload, { overwrite: true }, callback)

// here we validate and create a child search, we have a concrete id from the above call
api.validateInvestigateObject(type, parentSavedSearchPayload, callbackForValidate);
api.validateInvestigateObject(type, childSavedSearchPayload, callbackForValidate);


// api.createInvestigateObject(type, childSavedSearchPayload, callback)
