const isNullOrUndefined = require('./isNullOrUndefined');

function getDefaultValue(value, otherValue) {
  return isNullOrUndefined(value) ? otherValue : value;
}

module.exports = getDefaultValue;
