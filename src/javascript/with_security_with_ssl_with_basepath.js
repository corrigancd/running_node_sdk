const fs = require('fs');
const https = require('node:https');

const Openapi = require('../../../temp/javascript/dist/index');
const client = new Openapi.ApiClient('https://localhost:5606/wox'); // update this basepath for dev mode

const {
  parentSavedSearchPayload,
  childSavedSearchPayload,
  parentSavedSearchId,
  childSavedSearchId,
  searchType
} = require('./saved_search_data');

const {
  savedEidPayload,
  eidType,
  eidId
} = require('./saved_eid_data');

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
  if (response.error) {
    console.error(response.error.status, response.error.text);
  } else if (response.body.warning) {
    console.log('API called successfully with status ' + response.status + ' . But there was a warning: "' + response.body.warning + '"');
  } else {
    console.log('API called successfully with status: ' + response.status + '. Response body: ', response.body);
  }
};


const callbackForValidate = function (error, data, response) {
  console.log('--------------- RESULT OF VALIDATE API CALL -------------------');
  if (response.error) {
    console.error(response.error.status, response.error.text);
  } else if (response.body.warning) {
    console.log('API validated the ' + response.body.type + ' object successfully with status: ' + response.status + '. But there was a warning: "' + response.body.warning + '"');
  } else {
    console.log('API validated the ' + response.body.type + ' object successfully with status: ' + response.status + '. Response body: ', response.body);
  }
};

// Saved Search
// here we can specify an id, which is required for parent id in order to link it to the child search
// api.updateInvestigateObject(type, parentSavedSearchId, parentSavedSearchPayload, { overwrite: true }, callback)

// here we validate and create a child search, we have a concrete id from the above call
// api.validateInvestigateObject(searchType, parentSavedSearchPayload, callbackForValidate);
// api.validateInvestigateObject(searchType, childSavedSearchPayload, callbackForValidate);


// api.createInvestigateObjectWithId(searchType, parentSavedSearchId, parentSavedSearchPayload, { overwrite: false }, callback)

// creating an investigate object
// api.createInvestigateObject(type, childSavedSearchPayload, callback)

// savedEids
// api.createInvestigateObject(eidType, savedEidPayload, callback)
// api.validateInvestigateObject(eidType, savedEidPayload, callbackForValidate)
api.createInvestigateObjectWithId(eidType, eidId, savedEidPayload, { overwrite: true }, callback)