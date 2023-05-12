const fs = require('fs');
const https = require('node:https');

const Openapi = require('../../../master/temp/javascript/dist/index');
const client = new Openapi.ApiClient('https://localhost:5606/cdm'); // update this basepath for dev mode

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

const {
  savedRelationPayload,
  relationType,
  relationId
} = require('./saved_relation_data');

const {
  savedDashboardPayload,
  dashboardType,
  dashboardId
} = require('./saved_dashboard_data');

client.defaultHeaders['kbn-xsrf'] = 'anything';
client.authentications = {
  basicAuth: {
    type: 'basic',
    username: 'sirenserver',
    password: 'password'
  }
}

const options = {
  ca: fs.readFileSync('/Users/edwin/work/master/kibi-internal/pki/cacert.pem')
}
client.requestAgent = new https.Agent(options);
const api = new Openapi.ApiVersionV1Api(client)

const callback = function (error, data, response) {
  console.log('--------------- RESULT OF API CALL -------------------');
  if (error.response) {
    console.log(error.status, JSON.parse(error.response.text));
  } else if (response.body.warning) {
    console.log('API called successfully with status ' + response.status + ' . But there was a warning: "' + response.body.warning + '"');
  } else {
    console.log('API called successfully with status: ' + response.status + '. Response body: ', response.body);
  }
};


const callbackForValidate = function (error, data, response) {
  console.log('--------------- RESULT OF VALIDATE API CALL -------------------');
   if (error.response) {
    console.log(error.status, JSON.parse(error.response.text));
  } else if (response.body.warning) {
    console.log('API validated the ' + response.body.type + ' object successfully with status: ' + response.status + '. But there was a warning: "' + response.body.warning + '"');
  } else {
    console.log('API validated the ' + response.body.type + ' object successfully with status: ' + response.status + '. Response body: ', response.body);
  }
};

// Saved Search
// here we can specify an id, which is required for parent id in order to link it to the child search
// api.updateInvestigateObject(searchType, parentSavedSearchId, parentSavedSearchPayload, callback)

// // creating objects 
// api.createInvestigateObject(eidType, savedEidPayload, callback)
// api.createInvestigateObject(searchType, childSavedSearchPayload, callbackForValidate); // we have a concrete id from the above call
// api.createInvestigateObject(relationType, savedRelationPayload, callback)

// // validating various objects
// api.validateInvestigateObject(searchType, parentSavedSearchPayload, callbackForValidate);
// api.validateInvestigateObject(searchType, childSavedSearchPayload, callbackForValidate);
// api.validateInvestigateObject(eidType, savedEidPayload, callbackForValidate);
// api.validateInvestigateObject(relationType, savedRelationPayload, callbackForValidate);
api.validateInvestigateObject(dashboardType, savedDashboardPayload, callbackForValidate);


// // create investigate object with Id
// api.createInvestigateObjectWithId(searchType, parentSavedSearchId, parentSavedSearchPayload, { overwrite: false }, callback)
// api.createInvestigateObjectWithId(eidType, 'eid:ec984830-3007-11ec-a72f-7b66a29ade51', savedEidPayload, { overwrite: false }, callback)
// api.createInvestigateObjectWithId(relationType, relationId, savedRelationPayload, { overwrite: false }, callback)


// failed validations based on wrong type being passed to request
// api.validateInvestigateObject(searchType, parentSavedSearchPayload, callbackForValidate);
// api.validateInvestigateObject(eidType, parentSavedSearchPayload, callbackForValidate);
// api.validateInvestigateObject(searchType, savedEidPayload, callbackForValidate);
// api.validateInvestigateObject(eidType, childSavedSearchPayload, callbackForValidate);
// api.validateInvestigateObject(relationType, childSavedSearchPayload, callbackForValidate);