const { isBoolean, isObject } = require('lodash')
const Types = {
  Array: 'array',
  Boolean: 'boolean',
  Number: 'number',
  String: 'string',
  Object: 'object',
  Undefined: 'undefined'
};

const expectedFieldSchema = {
  name: { name: 'name', type: Types.String },
  esType: { name: 'esType', type: Types.String },
  type: { name: 'type', type: Types.String },
  count: { name: 'count', type: Types.Number },
  primaryKey: { name: 'primaryKey', type: Types.Boolean },
  singleValue: { name: 'singleValue', type: Types.Boolean },
  scripted: { name: 'scripted', type: Types.Boolean },
  script: { name: 'script', type: Types.String, dependency: 'scripted' },
  lang: { name: 'lang', type: Types.String, dependency: 'scripted' },
  searchable: { name: 'searchable', type: Types.Boolean },
  aggregatable: { name: 'aggregatable', type: Types.Boolean },
  readFromDocValues: { name: 'readFromDocValues', type: Types.Boolean },
}

const getFieldErrorMsg = (property, name, expectedType, actual) => `"${property}" property in the "${name}" field should be of type "${expectedType}" but type "${typeof actual}" was found: "${actual}"`;
const getSearchSourceJSONError = (property, expectedType, actual) => `"${property}" in "kibanaSavedObjectMeta.SearchSourceJSON" should be of type "${expectedType} but type "${typeof actual}" was found: "${actual}"`;
const throwError = (errorMsg) => { throw new Error(errorMsg) };

const sirenObjectValidation = (request) => {
  // after TSOA validation, we know that all attributes exist.
  // Here we can check more granular aspects of the saved objects
  // and provide clear errors of the issues with the object
  // The idea here is to fail with the biggest issue first

  try {
    const { indexPattern, siren, kibanaSavedObjectMeta } = request.payload.attributes;

    const verifyParentSearch = indexPattern && siren.parentId;
    if (verifyParentSearch) {
      throwError(`Parent search detected because of presence of "attributes.indexPattern" property.
     These should not have an "attributes.siren.parentId" property`);
    }

    const verifyChildSearch = !indexPattern && !siren.parentId;
    if (verifyChildSearch) {
      throwError(`Child search detected because there is no "attributes.indexPattern" property.
    These also need to have a "attributes.siren.parentId" property`);
    }

    if (indexPattern && indexPattern.fields) {
      const fields = JSON.parse(indexPattern.fields);
      fields.forEach((field) => {

        Object.keys(field).forEach(property => {
          const valid = expectedFieldSchema[property];
          const actual = field[property];

          const propertyDependentOnAnotherFieldCheck = valid.dependency && field[valid.dependency];

          if (propertyDependentOnAnotherFieldCheck && typeof actual !== valid.type) {
            throwError(getFieldErrorMsg(valid.name, field.name, valid.type, typeof property))
          } else if (typeof actual !== valid.type) {
            throwError(getFieldErrorMsg(valid.name, field.name, valid.type, typeof property))
          }
        })
      })
    }

    const searchSourceJSON = JSON.parse(kibanaSavedObjectMeta.searchSourceJSON);
    const { filter, highlightAll, version, query } = searchSourceJSON;
    console.log(filter, highlightAll, verifyChildSearch, query);
    if (!isBoolean(highlightAll)) {
      throwError(getSearchSourceJSONError('highlightAll', Types.Boolean, highlightAll));
    }
    if (!isBoolean(version)) {
      throwError(getSearchSourceJSONError('version', Types.Boolean, version));
    }
    if (!isObject(query)) {
      throwError(getSearchSourceJSONError('query', Types.Boolean, query));
    }
    if (!Array.isArray(filter)) {
      throwError(getSearchSourceJSONError('filter', Types.Array, filter));
    }

    filter.forEach(fil => {
      if (!isObject(fil)) {
        throwError(getSearchSourceJSONError('filter array', Types.Object, fil));
      }
    })


  } catch (e) {
    throwError(e.message);
  }

};


const input = {
  payload: {
    attributes: {
      "title": "test2",
      "description": "",
      "hits": 0,
      "columns": [
        "_source"
      ],
      "sort": [],
      "version": 6,
      "indexPattern": {
        "pattern": "siren-import-home-test2",
        "fields": `[{"name":"_id","esType":"_id","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_index","esType":"_index","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"_score","esType":"text","type":"number","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_siren","esType":"object","type":"unknown","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_siren.importId","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_siren.importTimestamp","esType":"date","type":"date","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_siren.importUser","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_siren.sic","esType":"object","type":"unknown","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_siren.sic.namespace","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"_source","esType":"_source","type":"_source","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":false,"aggregatable":false,"readFromDocValues":false},{"name":"_type","esType":"_type","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":false},{"name":"field_0","esType":"keyword","type":"string","count":0,"primaryKey":false,"singleValue":true,"scripted":false,"searchable":true,"aggregatable":true,"readFromDocValues":true},{"name":"testscripted","type":"number","count":0,"primaryKey":false,"singleValue":false,"scripted":true,"script":"doc['field_0'].value","lang":"painless","searchable":true,"aggregatable":true,"readFromDocValues":false}]`,
        "excludeIndices": false
      },
      "siren": {
        "indexingScope": "L",
        "ui": {
          "icon": "far fa-file-alt",
          "color": "#0D3580",
          "shortDescription": ""
        },
        "globalSearch": {
          "enabled": true,
          "boost": 10
        },
        "templateScripts": {
          "scriptIds": []
        },
        "revision": {
          "editableFieldsExceptions": [],
          "editableFieldsMode": "blacklist",
          "index": "siren-import-home-test2",
          "indexingScope": "L",
          "primaryKey": "_id",
          "isEditable": true
        }
      },
      "kibanaSavedObjectMeta": {
        "searchSourceJSON": `{"filter":[{"meta":{"id":"filter:revision-filter","negate":false,"disabled":false,"alias":"Hide originals when revised","sid":"search:d16d3ac0-bdaa-11ed-8339-576db874358e"},"query":{"bool":{"must_not":{"term":{"_siren_revision.archived":true}}}}}],"highlightAll":true,"version":true,"query":{}}`
      }
    }
  }
}


sirenObjectValidation(input);