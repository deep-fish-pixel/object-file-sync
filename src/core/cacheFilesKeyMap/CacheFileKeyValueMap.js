const { LineSeparateExpReg } = require("../constants/regExp");
const { error } = require("../../utils/log");
const { getRelativeDir } = require('../../utils/moduleOptions');
const getKeyValueByRepalceLine = require("../utils/string/getKeyValueByRepalceLine");
const isValidateValue = require("../utils/basicType/isValidateValue");

function CacheFileKeyValueMap(file, content, cacheDirKeyMap) {
  this.cacheKeyMap = new Map();
  this.cacheValueMap = new Map();
  Object.assign(this, {
    file,
    content,
    cacheDirKeyMap
  });
  this.addContent(content);
}

CacheFileKeyValueMap.prototype.addContent = function (content) {
  const lines = content.split(LineSeparateExpReg);
  const relativeDir = getRelativeDir(this.file);
  lines.forEach(line => {
    let key, value;
    getKeyValueByRepalceLine(line, (all, $1, keyMatch, $3, valueMatch) => {
      key = keyMatch;
      value = valueMatch;
    });
    if (isValidateValue(key) && isValidateValue(value)) {
      let otherFile;
      if (this.cacheKeyMap.has(key)) {
        error(`[文件同步]发现${relativeDir}有相同key:  ${key}`);
      } else if (this.cacheDirKeyMap && (otherFile = this.cacheDirKeyMap.hasKey(key))) {
        error(`[文件同步]发现${relativeDir}与${otherFile}有相同key: ${key}`);
      } else if (this.cacheValueMap.has(value)) {
        error(`[文件同步]发现${relativeDir}有相同value:  ${value}`);
      } else if (this.cacheDirKeyMap && (otherFile = this.cacheDirKeyMap.hasValue(value))) {
        error(`[文件同步]发现${relativeDir}与${otherFile}有相同value: ${value}`);
      }
      this.cacheKeyMap.set(key, value);
      this.cacheValueMap.set(value, key);
    }
  });
}

CacheFileKeyValueMap.prototype.getValue = function (key) {
  return this.cacheKeyMap.get(key);
}

CacheFileKeyValueMap.prototype.hasKey = function (key) {
  return this.cacheKeyMap.has(key)
}

CacheFileKeyValueMap.prototype.hasValue = function (value) {
  return this.cacheValueMap.has(value)
}

module.exports = CacheFileKeyValueMap;
