

// const indexFieldStrings = {
//   name: Types.String,
//   esType: Types.String,
//   type: Types.String,
//   count: Types.Number,
//   primaryKey: Types.Boolean,
//   singleValue: Types.Boolean,
//   scripted: Types.Boolean,
//   script: Types.String,
//   lang: Types.String,
//   searchable: Types.Boolean,
//   aggregatable: Types.Boolean,
//   readFromDocValues: Types.Boolean
// }
const Types = {
  Boolean: 'boolean',
  String: 'string',
  Number: 'number',
  Undefined: 'undefined'
};

const indexFieldStrings = {
  name: 'name',
  esType: 'esType',
  type: 'type',
  count: 'count',
  primaryKey: 'primaryKey',
  singleValue: 'singleValue',
  scripted: 'scripted',
  script: 'script',
  lang: 'lang',
  searchable: 'searchable',
  aggregatable: 'aggregatable',
  readFromDocValues: 'readFromDocValues'
}

const getFieldErrorMsg = (property, name, expectedType, actualType) => `The "${property}" property in the "${name}" field should be of type "${expectedType}" but "${actualType}" was found`;
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
      fields.forEach(({ name, esType, type, count, primaryKey, singleValue, scripted, script, lang, searchable, aggregatable, readFromDocValues }) => {

        if (typeof type !== Types.String) {
          throwError(getFieldErrorMsg(indexFieldStrings.type, name, Types.String, typeof type));
        }

        if (typeof count !== Types.Number) {
          throwError(getFieldErrorMsg(indexFieldStrings.count, name, Types.Number, typeof count));
        }

        if (typeof primaryKey !== Types.Boolean) {
          throwError(getFieldErrorMsg(indexFieldStrings.primaryKey, name, Types.Boolean, typeof primaryKey));
        }

        if (typeof singleValue !== Types.Boolean) {
          throwError(getFieldErrorMsg(indexFieldStrings.singleValue, name, Types.Boolean, typeof singleValue));
        }

        if (typeof scripted !== Types.Boolean) {
          throwError(getFieldErrorMsg(indexFieldStrings.scripted, name, Types.Boolean, typeof scripted));
        }

        if (!scripted && typeof esType !== Types.String) {
          throwError(getFieldErrorMsg(indexFieldStrings.esType, name, Types.String, typeof esType));
        }

        if (scripted && typeof script !== Types.String) {
          throwError(getFieldErrorMsg(indexFieldStrings.script, name, Types.String, typeof scripted));
        }

        if (scripted && typeof lang !== Types.String) {
          throwError(getFieldErrorMsg(indexFieldStrings.lang, name, Types.String, typeof lang));
        }

        if (typeof searchable !== Types.Boolean) {
          throwError(getFieldErrorMsg(indexFieldStrings.searchable, name, Types.Boolean, typeof searchable));
        }

        if (typeof aggregatable !== Types.Boolean) {
          throwError(getFieldErrorMsg(indexFieldStrings.aggregatable, name, Types.Boolean, typeof aggregatable));
        }

        if (typeof readFromDocValues !== Types.Boolean) {
          throwError(getFieldErrorMsg(indexFieldStrings.readFromDocValues, name, Types.Boolean, typeof readFromDocValues));
        }
      })
    }

    // console.log(kibanaSavedObjectMeta.searchSourceJSON);
    // const searchSourceJSON = JSON.parse(kibanaSavedObjectMeta.searchSourceJSON);
    // if (typeof searchSourceJSON !== 'object') { // we can iterate through arrays etc here to check
    //   errorMsg = `"attributes.kibanaSavedObjectMeta.searchSourceJSON" should be a valid stringified object`;
    // }
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
        "searchSourceJSON": `{"filter":[{"meta":{"id":"filter:revision-filter","negate":false,"disabled":false,"alias":"Hide originals when revised","sid":"search:d16d3ac0-bdaa-11ed-8339-576db874358e"},"query":{"bool":{"must_not":{"term":{"_siren_revision.archived":true}}}}}],"highlightAll":true,"version":true,"query":{"match_all":{}}}`
      }
    }
  }
}


sirenObjectValidation(input);