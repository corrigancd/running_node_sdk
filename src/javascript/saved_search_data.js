const parentSearchAttributes = {
  title: 'Open API Testing',
  description: '',
  hits: 99,
  columns: "['_source']",
  sort: "[ '_score', 'desc']",
  // index pattern for root search
  indexPattern: {
    pattern: 'siren-import-home-open_api_test',
    fields: '[{"name":"_id","esType":"_id","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","esType":"_index","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","esType":"text","type":"number","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_siren","esType":"object","type":"unknown","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_siren.importId","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_siren.importTimestamp","esType":"date","type":"date","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_siren.importUser","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_siren.sic","esType":"object","type":"unknown","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_siren.sic.namespace","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_source","esType":"_source","type":"_source","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","esType":"_type","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"field_0","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true}]',
    excludeIndices: false,
  },
  siren: {
    // no parent for root searches
    // "parentId": "search:ec984830-3007-11ec-a72f-7b66a29ade54",
    indexingScope: 'L',
    ui: {
      icon: 'far fa-file-alt',
      color: '#0D3580',
      shortDescription: '',
    },
    globalSearch: {
      enabled: true,
      boost: 10,
    },
    templateScripts: {
      scriptIds: [],
    },
    revision: {
      index: 'siren-import-home-open_api_test',
      isEditable: true,
      primaryKey: '_id',
      editableFieldsMode: 'blacklist',
      filteringMode: 'filter-by-index-join',
      editableFieldsExceptions: [],
      indexingScope: 'L',
      copyToFields: {},
    },
  },
  kibanaSavedObjectMeta: {
    searchSourceJSON: '{"filter":[{"meta":{"id":"filter:revision-filter","negate":false,"disabled":false,"alias":"Hide originals when revised"},"query":{"bool":{"must_not":{"term":{"_siren_revision.archived":true}}}},"$state":{"store":"appState"}}],"highlightAll":true,"version":true,"query":{"match_all":{}}}',
  },
  version: 10,
}

const childSearchAttributes = {
  title: 'Open API Testing',
  description: '',
  hits: 99,
  columns: "['_source']",
  sort: "[ '_score', 'desc']",
  // no index pattern for child search
  // "indexPattern": {
  //   "pattern": "siren-import-home-open_api_test",
  //   "fields": '[{"name":"_id","esType":"_id","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","esType":"_index","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","esType":"text","type":"number","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_siren","esType":"object","type":"unknown","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_siren.importId","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_siren.importTimestamp","esType":"date","type":"date","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_siren.importUser","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_siren.sic","esType":"object","type":"unknown","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_siren.sic.namespace","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_source","esType":"_source","type":"_source","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","esType":"_type","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"field_0","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true}]',
  //   "excludeIndices": false
  // },
  siren: {
    // parentId for child search
    parentId: 'search:ec984830-3007-11ec-a72f-7b66a29ade54',
    indexingScope: 'L',
    ui: {
      icon: 'far fa-file-alt',
      color: '#0D3580',
      shortDescription: '',
    },
    globalSearch: {
      enabled: true,
      boost: 10,
    },
    templateScripts: {
      scriptIds: [],
    },
    revision: {
      index: 'siren-import-home-open_api_test',
      isEditable: true,
      primaryKey: '_id',
      editableFieldsMode: 'blacklist',
      filteringMode: 'filter-by-index-join',
      editableFieldsExceptions: [],
      indexingScope: 'L',
      copyToFields: {},
    },
  },
  kibanaSavedObjectMeta: {
    searchSourceJSON: '{"filter":[{"meta":{"id":"filter:revision-filter","negate":false,"disabled":false,"alias":"Hide originals when revised"},"query":{"bool":{"must_not":{"term":{"_siren_revision.archived":true}}}},"$state":{"store":"appState"}}],"highlightAll":true,"version":true,"query":{"match_all":{}}}',
  },
  version: 10,
};

const isGlobal = false;

module.exports.searchType = 'search';

module.exports.parentSavedSearchId = 'search:ec984830-3007-11ec-a72f-7b66a29ade54';

module.exports.parentSavedSearchPayload = {
  attributes: parentSearchAttributes,
  isGlobal,
}

module.exports.childSavedSearchId = 'search:ec984830-3007-11ec-a72f-7b66a29ade54childof';
module.exports.childSavedSearchPayload = {
  attributes: childSearchAttributes,
  isGlobal,
}
