export const isNumber = (number) => {
  return typeof number === 'number'
}

export const isString = (obj) => {
  return Object.prototype.toString.call(obj) === '[object String]';
};

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

export const isHtmlElement = (node) => {
  return node && node.nodeType === Node.ELEMENT_NODE;
};

export const isFunction = (functionToCheck) => {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

export const isUndefined = (val) => {
  return val === void 0;
};

export const isDefined = (val) => {
  return val !== undefined && val !== null;
};
