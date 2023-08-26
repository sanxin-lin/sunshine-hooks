import { isSet, isMap, isDate, isBoolean, isString, isPlainObject, isNaN, isNull } from 'lodash';

export function guessSerializerType<T extends string | number | boolean | object | null>(
  rawInit: T,
) {
  return isNull(rawInit)
    ? 'any'
    : isSet(rawInit)
    ? 'set'
    : isMap(rawInit)
    ? 'map'
    : isDate(rawInit)
    ? 'date'
    : isBoolean(rawInit)
    ? 'boolean'
    : isString(rawInit)
    ? 'string'
    : isPlainObject(rawInit)
    ? 'object'
    : !isNaN(rawInit)
    ? 'number'
    : 'any';
}