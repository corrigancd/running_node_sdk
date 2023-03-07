const Openapi = require('../../../temp/javascript/dist/index');

const client = new Openapi.ApiClient('http://localhost:5606');
client.defaultHeaders['kbn-xsrf'] = 'anything';

const api = new Openapi.DefaultApi(client)

const {
  parentSavedSearchPayload,
  childSavedSearchPayload
} = require('./data');

const callback = function (error, data, response) {
  console.log('--------------- RESULT OF API CALL -------------------');
  if (error) {
    console.error(error.status, response.text);
  } else {
    console.log('API called successfully with status: ' + response.status + '. Response body: ', response.body);
  }
};

api.createSavedSearchWithId(parentSavedSearchPayload.params.id, parentSavedSearchPayload, callback);
api.createSavedSearchWithId(childSavedSearchPayload.params.id, childSavedSearchPayload, callback);
