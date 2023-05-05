
const {
  parentSavedSearchId,
} = require('./saved_search_data');

module.exports.relationId = 'relation:ec984830-3007-11ec-a72f-7b66a29ade54';
module.exports.relationType = 'relation';
module.exports.savedRelationPayload = {
  attributes: {
    title: '',
    version: 10,
    countEnabled: false,
    undirected: false,
    timeout: -1,
    joinType: '',
    rangeField: 'funded_date',
    rangeId: parentSavedSearchId,
    domainField: 'birth_date',
    domainId: parentSavedSearchId,
    inverseLabel: 'has headquarters in',
    inverseOf: 'relation: b060f360-e386-11ed-a7f8-5960b7d66484',
    directLabel: 'category',
  }
}
