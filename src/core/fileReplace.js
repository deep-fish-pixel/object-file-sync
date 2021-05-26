const Diff = require('diff');
const { getFile, writeFile } = require("../utils/cacheFile");
const { KeyMapExpReg, LineSeparateExpReg } = require("./constants/regExp");


module.exports = function fileReplace(target, dist) {
  Promise.all([getFile(target), getFile(target, true), getFile(dist)])
    .then(([targetOldContent, targetContent, distContent]) => {
      const diffList = Diff.diffLines(distContent, targetContent);
      const diffOldTargetList = Diff.diffLines(targetOldContent, targetContent);
      console.log(diffList)
      const {
        removedObject,
        changeKeysObject
      } = getKeyValueObjects(diffList);

      Object.assign(changeKeysObject, getChangeKeysObject(diffOldTargetList));

      console.log('====1===', changeKeysObject)
      const distValue = renderContent(diffList, removedObject, changeKeysObject);
      console.log(distValue)

      writeFile(dist, distValue);
      if (Object.keys(changeKeysObject).length) {
        console.log(getAddedContent(diffList))
        writeFile(target, getAddedContent(diffList));
      }
    });
}

function renderContent(diffList, removedObject, changeKeysObject){
  let content = '';
  diffList.forEach( diff => {
    const { added, removed, value } = diff;
    if (added) {
      const values = value.split(LineSeparateExpReg);
      content += values.map(value => {
        // 对修改内容的键值对进行替换处理，便于内容保持同步
        return value.replace(/(['"]?)([\w\-]+)(['"]?\s*:\s*['"]?)([\s\S]*)(['"]?)([,]\s*|\s*$)/g, (all, $1, key, $3, value, $5) => {
          const changeKey = changeKeysObject[key] || key;
          return `${$1}${key}${$3}${removedObject[changeKey] || value}${$5}`;
        });
      }).join(',\n');
    } else if (!removed) {
      content += value;
    }
  })
  return content;
}

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

function getKeyValueByLine(value) {
  let key, keyValue;
  value.replace(KeyMapExpReg, (all, $1, $2) => {
    key = $1;
    keyValue = $2;
  });
  return {
    key,
    keyValue,
  };
}

function getChangeKeysByNext(diff, nextDiff) {
  const { added, removed, value } = diff;
  const { added: nextAdded, removed: nextRemoved, value: nextValue } = nextDiff;
  const {key, keyValue} = getKeyValueByLine(value);
  const {key: nextKey, keyValue: nextKeyValue} = getKeyValueByLine(nextValue);
  debugger
  if (keyValue === nextKeyValue && key !== undefined && key.indexOf('>') === -1) {
    return {
      fromKey: key,
      changeKey: nextKey,
    }
  }
  return {};
}

function getKeyValueObjects(diffList) {
  const removedObject = {};
  const changeKeysObject = {};

  diffList.forEach( (diff, index) => {
    const { added, removed, value } = diff;
    if (removed) {
      const values = value.split(LineSeparateExpReg);
      console.log(values, value, '123123123123')

      values.forEach(value => {
        value.replace(KeyMapExpReg, (all, key, value) => {
          console.log(all, key, value, '======');
          removedObject[key] = value;
        });
      });
    } else if (added) {
      const values = value.split(LineSeparateExpReg);
      values.forEach(value => {
        value.replace(KeyMapExpReg, (all, key, $2) => {
          console.log(all, key, value, '======add=======');
          if (key.match(/[\w\-]+>/)) {
            const [fromKey, changeKey] = key.split('>');
            changeKeysObject[changeKey] = fromKey;
          }
        });
      });
      diff.value = value.replace(KeyMapExpReg, (all, $1, fromKey, changeKey, $3) => {
        return `${$1}${changeKey}${$3}`
      });

    }
  })
  return {
    removedObject,
    changeKeysObject
  };
}

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
