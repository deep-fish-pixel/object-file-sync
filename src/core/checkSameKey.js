const { LineSeparateExpReg, KeyMapRegExp } = require("./constants/regExp");

const cache = new Map();

function getKeyValueList(content) {
  const lines = content.split(LineSeparateExpReg);
  return lines;
}

module.exports = function (file, content) {
  const lines = getKeyValueList(content);

}
