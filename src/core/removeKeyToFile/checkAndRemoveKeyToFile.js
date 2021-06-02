const getKeyValueByLine = require('../utils/keyValue/getKeyValueByLine');
const {getModuleOptions, getModulePath} = require('../../utils/moduleOptions');
const removeKeyToFile = require('./removeKeyToFile');

/**
 * 校验key的路径，并根据路径移到对应的文件
 * @param target
 * @param content
 * @returns {{removeKeyToFile: removeKeyToFile, content: string}}
 */
module.exports = function (target, content) {
  const { root, setKeyToFileSeperator } = getModuleOptions();
  // 不存在key分割管理，直接返回内容
  if (!setKeyToFileSeperator) {
    return {
      content,
      removeKeyToFile: () => {},
    };
  }
  const { relativeDir, rootSubDir, rootDirSubFile, } = getModulePath(target);
  const subFilePathes = rootDirSubFile.replace(/\.\w+$/, '');
  const keyValues = [];

  let lines = content.split(/\n/);
  lines = lines.filter((line => {
    const { key, keyValue, } = getKeyValueByLine(line);
    if (key === undefined || keyValue === undefined) {
      return true;
    }
    const pathes = key.split(setKeyToFileSeperator);
    const keyFilePath = pathes.join('/').replace(/\/[^/]+$/, '');

    if (keyFilePath === subFilePathes || pathes.length <= 1) {
      return true;
    } else {
      keyValues.push({
        key,
        keyValue,
        pathes,
      });
      return false;
    }
  }));

  console.log('checkAndRemoveKeyToFile=============1', target, lines.join('\n'))
  return {
    content: lines.join('\n'),
    keys: keyValues.map(keyValue => keyValue.key).join(','),
    removeKeyToFile: () => {
      // 一起移到文件中
      if (keyValues.length) {
        removeKeyToFile({ root, relativeDir, rootSubDir, rootDirSubFile } , keyValues);
      }
    }
  };
}
