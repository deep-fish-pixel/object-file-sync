const isNullOrUndefined = require("./isNullOrUndefined");

function isValidateValue(value) {
  return !isNullOrUndefined(value);
}

module.exports = isValidateValue;
