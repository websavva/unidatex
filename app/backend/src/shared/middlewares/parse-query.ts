import { Handler, Request } from 'express';

const PRIMITIVE_VALUES_MAP = new Map([
  ['false', false],
  ['true', true],
  ['null', null],
]);

export const parseQueryField = (fieldValue: Request['query'][string]) => {
  if (Array.isArray(fieldValue))
    return fieldValue.map((fieldSubValue) => parseQueryField(fieldSubValue));
  else if (typeof fieldValue !== 'string') {
    return fieldValue;
  } else if (/^[+-]?\d+(\.\d+)?$/.test(fieldValue)) {
    return +fieldValue;
  } else if (PRIMITIVE_VALUES_MAP.has(fieldValue)) {
    return PRIMITIVE_VALUES_MAP.get(fieldValue);
  } else {
    return fieldValue;
  }
};

export const parseQueryMiddleware: Handler = (req, res, next) => {
  if (req.query) {
    req.query = Object.fromEntries(
      Object.entries(req.query).map(([fieldName, fieldValue]) => [
        fieldName,
        parseQueryField(fieldValue),
      ]),
    );
  }

  next();
};
