const { warn, error } = require('console-log-cmd');
const { LineSeparateExpReg } = require('../constants/regExp');
const { getRelativeDir } = require('../../utils/moduleOptions');
const getKeyValueByRepalceLine = require('../utils/string/getKeyValueByRepalceLine');
const isValidateValue = require('../utils/basicType/isValidateValue');

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
        error(`[文件验证] ${relativeDir}文件有相同key:  ${key}`);
      } else if (this.cacheDirKeyMap && (otherFile = this.cacheDirKeyMap.hasKey(key))) {
        debugger
        error(`[文件验证] ${relativeDir}与${getRelativeDir(otherFile)}文件有相同key: ${key}`);
      } else if (this.cacheValueMap.has(value)) {
        warn(`[文件验证] ${relativeDir}文件有相同value值:  ${value}`);
      } else if (this.cacheDirKeyMap && (otherFile = this.cacheDirKeyMap.hasValue(value))) {
        warn(`[文件验证] ${relativeDir}与${getRelativeDir(otherFile)}文件有相同value值: ${value}`);
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

CacheFileKeyValueMap.prototype.getContent = function () {
  return this.cacheValueMap.content;
}

module.exports = CacheFileKeyValueMap;
