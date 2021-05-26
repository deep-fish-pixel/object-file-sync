const { LineSeparateExpReg, KeyMapExpReg } = require("./constants/regExp");

const cache = new Map();

function getKeyValueList(content) {
  const lines = content.split(LineSeparateExpReg);
  console.log(lines)
  return lines;
}

module.exports = function (file, content) {
  const lines = getKeyValueList(content);

}
