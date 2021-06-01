const Diff = require('diff');
const getKeyValueByRepalceLine = require("./utils/string/getKeyValueByRepalceLine");
const getDefaultValue = require("./utils/basicType/getDefaultValue");
const { getFile, writeFile } = require("../utils/cacheFile");
const { KeyMapRegExp, LineSeparateExpReg } = require("./constants/regExp");
const { getModuleOptions } = require('../utils/moduleOptions');

/**
 * 对文件内容键值对替换
 * @param target
 * @param dist
 */
module.exports = function fileReplace(target, dist) {
  Promise.all([getFile(target), getFile(target, true), getFile(dist)])
    .then(([targetOldContent, targetContent, distContent]) => {
      const diffList = Diff.diffLines(distContent, targetContent);
      const diffOldTargetList = Diff.diffLines(targetOldContent, targetContent);
      const {
        removedObject,
        changeKeysObject
      } = getKeyValueObjects(diffList);

      Object.assign(changeKeysObject, getChangeKeysObject(diffOldTargetList));

      const distValue = renderContent(diffList, removedObject, changeKeysObject);

      writeFile(dist, distValue);
      if (Object.keys(changeKeysObject).length) {
        writeFile(target, getAddedContent(diffList));
        const { changeKeyHandle } = getModuleOptions();
        if (changeKeyHandle) {
          changeKeyHandle(changeKeysObject);
        }
      }
      // setKeyToFileSeperator
    });
}

/**
 * 根据键值内容对其他需要同步文件进行替换
 * @param diffList
 * @param removedObject
 * @param changeKeysObject
 * @returns {string}
 */
function renderContent(diffList, removedObject, changeKeysObject){
  let content = '';
  diffList.forEach( diff => {
    const { added, removed, value } = diff;
    if (added) {
      const values = value.split(LineSeparateExpReg);
      content += values.map(value => {
        // 对修改内容的键值对进行替换处理，便于内容保持同步
        return getKeyValueByRepalceLine(value, (all, $1, key, $3, value, $5, $6) => {
          const changeKey = changeKeysObject[key] || key;
          return `${$1}${key}${$3}${getDefaultValue(removedObject[changeKey], value)}${$5}${$6}`;
        });
      }).join('\n');
    } else if (!removed) {
      content += value;
    }
  })
  return content;
}

/**
 * 根据diff获取新增完整内容
 * @param diffList
 * @returns {string}
 */
function getAddedContent(diffList) {
  let content = '';
  diffList.forEach( (diff, index) => {
    const { added, removed, value } = diff;
    if (added || !removed) {
      content += value
    }
  });
  return content;
}

/**
 * 按行获取键值
 * @param value
 * @returns {{keyValue, key}}
 */
function getKeyValueByLine(value) {
  let key, keyValue;
  value.replace(KeyMapRegExp, (all, $1, $2) => {
    key = $1;
    keyValue = $2;
  });
  return {
    key,
    keyValue,
  };
}

/**
 * 根据下一个diff，获取修改前后的旧值新值
 * @param diff
 * @param nextDiff
 * @returns {{}|{changeKey, fromKey}}
 */
function getChangeKeysByNext(diff, nextDiff) {
  const { added, removed, value } = diff;
  if (nextDiff) {
    const { added: nextAdded, removed: nextRemoved, value: nextValue } = nextDiff;
    const {key, keyValue} = getKeyValueByLine(value);
    const {key: nextKey, keyValue: nextKeyValue} = getKeyValueByLine(nextValue);
    if (keyValue === nextKeyValue && key !== undefined && key.indexOf('>') === -1) {
      return {
        fromKey: key,
        changeKey: nextKey,
      }
    }
  }
  return {};
}

/**
 * 根据>符号 获取多个 修改前后的旧值新值
 * @param diffList
 * @returns {{removedObject: {}, changeKeysObject: {}}}
 */
function getKeyValueObjects(diffList) {
  const removedObject = {};
  const changeKeysObject = {};

  diffList.forEach( (diff, index) => {
    const { added, removed, value } = diff;
    if (removed) {
      const values = value.split(LineSeparateExpReg);

      values.forEach(value => {
        getKeyValueByRepalceLine(value, (all, $1, key, $3, value) => {
          removedObject[key] = value;
        });
      });
    } else if (added) {
      const values = value.split(LineSeparateExpReg);
      values.forEach(value => {
        getKeyValueByRepalceLine(value, (all, $1, key, $3, value) => {
          if (key.match(/[\w\-.]+>/)) {
            const [fromKey, changeKey] = key.split('>');
            changeKeysObject[changeKey] = fromKey;
          }
        });
      });
      diff.value = value.replace(/(['"]?)([\w\-.]+)>([\w\-]*)(['"]?\s*:\s*['"]?)/, (all, $1, fromKey, changeKey, $3) => {
        return `${$1}${changeKey}${$3}`
      });
    }
  })
  return {
    removedObject,
    changeKeysObject
  };
}

/**
 * 根据修改前后，获取多个 新值旧值
 * @param diffOldTargetList
 * @returns {{}}
 */
function getChangeKeysObject(diffOldTargetList) {
  const changeKeysObject = {};

  diffOldTargetList.forEach( (diff, index) => {
    const { removed } = diff;
    if (removed) {
      const {fromKey, changeKey} = getChangeKeysByNext(diff, diffOldTargetList[index + 1]);
      if (fromKey || changeKey) {
        changeKeysObject[changeKey] = fromKey;
      }
    }
  })
  return changeKeysObject;
}

