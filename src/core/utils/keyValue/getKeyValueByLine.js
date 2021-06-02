const {KeyMapRegExp, KeyMapNumBooleanRegExp} = require('../../constants/regExp');

/**
 * 按行获取键值
 * @param value
 * @returns {{keyValue, key}}
 */
module.exports = function (value) {
  let key, keyValue;
  value.replace(KeyMapRegExp, (all, $1, $2) => {
    key = $1;
    keyValue = $2;
  });
  if (key === undefined) {
    value.replace(KeyMapNumBooleanRegExp, (all, $1, $2) => {
      key = $1;
      keyValue = $2.replace(/,\s*$/, '');
    });
  }
  return {
    key,
    keyValue,
  };
}
