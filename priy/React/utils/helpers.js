// utilities function used by the main functions

export function extractKeyValueObject(map) {
  /* Map {
    key=>[value , Set[ [span,evaluator,key] ..... ] ]
  }
  */

  const result = {};

  for (const [key, [value, _]] of map.entries()) {
    result[key] = value;
  }

  return result;
}

export function extractExistingKeysAndValues(keys, sourceObject) {
  const definedKeys = [];
  const values = [];

  for (const key of keys) {
    if (key in sourceObject) {
      definedKeys.push(key);
      values.push(sourceObject[key]);
    }
  }

  return [definedKeys,
    values];
}