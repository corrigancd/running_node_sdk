const { isBoolean, isObject, isString, isNull, isNumber, isUndefined, isArray } = require('lodash')
const Types = {
  Array: 'array',
  Boolean: 'boolean',
  Number: 'number',
  String: 'string',
  Object: 'object',
  Undefined: 'undefined'  
};

const getDefaultSchema = () => ({
  required: true
});

const expectedFieldSchema = {
  name: { ...getDefaultSchema(), types: [Types.String] },
  esType: { ...getDefaultSchema(), types: [Types.String], negativeDependency: 'scripted', required: false },
  type: { ...getDefaultSchema(), types: [Types.String] },
  count: { ...getDefaultSchema(), types: [Types.Number] },
  primaryKey: { ...getDefaultSchema(), types: [Types.Boolean] },
  singleValue: { ...getDefaultSchema(), types: [Types.Boolean] },
  scripted: { ...getDefaultSchema(), types: [Types.Boolean] },
  script: { ...getDefaultSchema(), types: [Types.String], dependency: 'scripted', required: false },
  lang: { ...getDefaultSchema(), types: [Types.String], dependency: 'scripted', required: false },
  searchable: { ...getDefaultSchema(), types: [Types.Boolean] },
  aggregatable: { ...getDefaultSchema(), types: [Types.Boolean] },
  readFromDocValues: { ...getDefaultSchema(), types: [Types.Boolean] },
}

const expectedFilterSchema = {
  // required types
  sid: { ...getDefaultSchema(), types: [Types.String] },
  negate: { ...getDefaultSchema(), types: [Types.Boolean] },
  disabled: { ...getDefaultSchema(), types: [Types.Boolean, null] },

  // not required types
  id: { ...getDefaultSchema(), types: [Types.String], required: false },
  alias: { ...getDefaultSchema(), types: [Types.String], required: false },
  version: { ...getDefaultSchema(), types: [Types.Number], required: false },
  system: { ...getDefaultSchema(), types: [Types.Boolean], required: false },
  value: { ...getDefaultSchema(), types: [Types.String], required: false },
  key: { ...getDefaultSchema(), vtypes: [Types.String], required: false },
  type: { ...getDefaultSchema(), types: [Types.String], required: false },
  numShapes: { ...getDefaultSchema(), types: [Types.Number], required: false },
  alias_tmpl: { ...getDefaultSchema(), types: [Types.String], required: false }
}

const getSearchSourceJSONError = (property, expectedType, actual) => `"${property}" in "kibanaSavedObjectMeta.SearchSourceJSON" should be of type "${expectedType} but type "${typeof actual}" was found: "${actual}"`;
const throwError = (errorMsg) => { throw new Error(errorMsg) };


const checkValidType = (property, validTypes, required, value) => {
  if (!required && isUndefined(value)) {
    return;
  }

  let errorMsg = '';
  for (const type of validTypes) {
    if (type === Types.Array && Array.isArray(value)) {
      break;
    } else if (type === Types.Boolean && isBoolean(value)) {
      break;
    } else if (type === Types.String && isString(value)) {
      break;
    } else if (type === null && isNull(value)) {
      break;
    } else if (type === Types.Number && isNumber(value)) {
      break;
    } else if (type === Types.Object && isObject(value)) {
      break;
    } else if (type === Types.Undefined && isUndefined(value)) {
      break;
    } else {
      errorMsg += `"${property}" should be one of "${validTypes}" types, but "${value}" is none of the allowed\n`;
    }
  }

  if (errorMsg) {
    return errorMsg;
  }
}

const checkValidTypes = (object, expectedTypesSchema, context) => {
  for (const [property, value] of Object.entries(object)) {
    const propertyFromSchema = expectedTypesSchema[property];

    if (propertyFromSchema) {
      const dependentOnAnotherPropertyToBeTruthy = propertyFromSchema.dependency && !object[propertyFromSchema.dependency];
      if (dependentOnAnotherPropertyToBeTruthy) {
        throwError(`"${property}" property requires ${propertyFromSchema.dependency} property to be truthy in the current object in "${context}"`);
      }

      const dependentOnAnotherPropertyToBeFalsy = propertyFromSchema.negativeDependency && object[propertyFromSchema.negativeDependency];
      if (dependentOnAnotherPropertyToBeFalsy) {
        console.log(object)
        throwError(`"${property}" property requires ${propertyFromSchema.negativeDependency} property to be falsy in the current object in "${context}"`);
      }

      const errorMessage = checkValidType(property, propertyFromSchema.types, propertyFromSchema.required, value)
      if (errorMessage) {
        throwError(errorMessage);
      }
    } else {
      throwError(`${property} is not a valid property in "${context}"`)
    }
  }
}

const checkRequiredTypes = (object, expectedTypesSchema, context) => {
  for (const [property, value] of Object.entries(expectedTypesSchema)) {
    if (value.required && isUndefined(object[property])) {
      throwError(`"${property}" is required in the object array items in "${context}"`)
    }
  }
}

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

    const fields = JSON.parse(indexPattern.fields);
    const context = 'indexPattern.fields';

    const required = true;
    checkValidType('fields', [Types.Array], required, fields);

    fields.forEach((field) => {
      checkRequiredTypes(field, expectedFieldSchema, context);
      checkValidTypes(field, expectedFieldSchema, context);
    })

    const searchSourceJSON = JSON.parse(kibanaSavedObjectMeta.searchSourceJSON);
    const { filter, highlightAll, version, query } = searchSourceJSON;

    checkValidType('highlightAll', [Types.Boolean], required, highlightAll);
    checkValidType('version', [Types.Boolean], required, version);
    checkValidType('query', [Types.Object], required, query);
    checkValidType('filter', [Types.Boolean], required, filter);
    

    filter.forEach(individualFilter => {
      if (!isObject(individualFilter)) {
        throwError(getSearchSourceJSONError('filter array', Types.Object, individualFilter));
      }

      const context = 'kibanaSavedObjectMeta.SearchSourceJSON.filter';
      checkRequiredTypes(individualFilter.meta, expectedFilterSchema, context);
      checkValidTypes(individualFilter.meta, expectedFilterSchema, context);
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