const diff = require('fast-diff');
const Diff = require('diff');
const { getFile, writeFile } = require("./cacheFile");

module.exports = function fileReplace(target, dist) {
  Promise.all([getFile(target, true), getFile(dist)])
    .then(([targetContent, distContent]) => {
      // console.log(target, dist);
      // console.log(diff(targetContent, distContent, 1));
      // const diffList = splitLine(diff(targetContent, distContent, 1));
      const diffList = Diff.diffLines(distContent, targetContent);
      console.log(diffList)
      const {
        removedObject,
        changeKeysObject
      } = getKeyValueObjects(diffList);
      console.log('====1===', changeKeysObject)
      const distValue = renderContent(diffList, removedObject, changeKeysObject);
      console.log(distValue)

      // writeFile(dist, distValue);
    });
}

function renderContent(diffList, removedObject, changeKeysObject){
  let content = '';
  diffList.forEach( diff => {
    const { added, removed, value } = diff;
    if (added) {
      const values = value.split(/,\n/);
      content += values.map(value => {
        return value.replace(/(['"]?)([\w\-]+)(['"]?\s*:\s*['"]?)([\s\S]*)(['"]?)([,]\s*|\s*$)/g, (all, $1, key, $3, value, $5) => {
          const changeKey = changeKeysObject[key] || key;
          return `${$1}${changeKey}${$3}${removedObject[changeKey] || value}${$5}`;
        });
      }).join(',\n');
    } else if (!removed) {
      content += value;
    }
  })
  console.log(content)
  return content;
}

function getKeyValueObjects(diffList) {
  const removedObject = {};
  const changeKeysObject = {};

  diffList.forEach( (diff, index) => {
    if (diff.removed) {
      const value = diff.value;
      const values = value.split(/,\n\s*|\n\s*$/);
      console.log(values, value, '123123123123')

      values.forEach(value => {
        if (value === undefined) {
          console.log(values)
          console.log('==========!value.replace')
        }
        value.replace(/['"]?([\w\-]+)['"]?\s*:\s*['"]?([\s\S]*)['"]?([,]\s*|\s*$)/g, (all, key, value) => {
          console.log(all, key, value, '======');
          removedObject[key] = value;
        });
      });
    } else if (diff.added) {
      const value = diff.value;
      const values = value.split(/,\n\s*|\n\s*$/);
      console.log(values, value, '123123123123')
      debugger

      values.forEach(value => {
        if (value === undefined) {
          console.log(values)
          console.log('==========!value.replace')
        }
        value.replace(/['"]?([\w\->]+)['"]?\s*:\s*['"]?([\s\S]*)['"]?([,]\s*|\s*$)/g, (all, key, $2) => {
          console.log(all, key, value, '======add=======');
          if (key.match(/[\w\-]+>/)) {
            const [fromKey, changeKey] = key.split('>');
            changeKeysObject[changeKey] = fromKey;
          }
        });
      });
      diff.value = diff.value.replace(/(['"]?)([\w\-]+)>([\w\-]*)(['"]?\s*:\s*['"]?)/, (all, $1, fromKey, changeKey, $3) => {
        return `${$1}${changeKey}${$3}`
      });

    }
  })
  console.log(removedObject)
  return {
    removedObject,
    changeKeysObject
  };
}

function getChangeKeysObject(diffList) {
  const changeKeysObject = {};
  diffList.forEach( diff => {
    if (diff.removed) {
      const value = diff.value;
      const values = value.split(/,\n\s*|\n\s*$/);
      console.log(values, value, '123123123123')

      values.forEach(value => {
        if (value === undefined) {
          console.log(values)
          console.log('==========!value.replace')
        }
        value.replace(/['"]?([\w\-]+)['"]?\s*:\s*['"]?([\s\S]*)['"]?([,]\s*|\s*$)/g, (all, $1, $2) => {
          console.log(all, $1, $2, '======');
          removedObject[$1] = $2;
        });
      });
    }
  })
  return changeKeysObject;
}

const startLineFlag = /^[ \t]*\n[ \t]*/;
const endLineFlag = /[ \t]*\n[ \t]*$/;


function splitLine(diffList) {
  let splitLines = [];
  diffList.forEach(diff => {
    const [operate, value] = diff;
    const lines = value.split('\n');
    lines.forEach( (line, index) => {
      if (index === lines.length - 1) {
        splitLines.push([operate, line]);
      } else {
        splitLines.push([operate, `${line}\n`]);
      }
    });
  });
  return splitLines;
}
function getLines(diffList, index){
  const {value, prevValue, nextValue, all, } = getLine(diffList, index);
  const lines = all.split('\n');
  return lines.map((line) => {
    return {
      value: line.split(''),
    }
  })

}


function getLine(diffList, index, reverse) {
  const value = diffList[index][1];
  const prevValue = getPrevLineFlag(diffList, index, reverse);
  const nextValue = getNextLineFlag(diffList, index, reverse);
  return {
    value,
    prevValue,
    nextValue,
    all: `${prevValue}${value}${nextValue}`,
    isKeyValue: isKeyValue(`${prevValue}${value}${nextValue}`),
    isValue: prevValue.indexOf(':') >= 0,
  };
}

function isKeyValue(value){
  try {
    eval(`{${value}}`);
    return true;
  } catch (e){}
  return false;
}

function getPrevLineFlag(diffList, index){
  const [operate, value] = diffList[index]
  if (value.match(startLineFlag)) {
    return '';
  } else {
    let result = '';
    while (--index >= 0) {
      let [preOperate, preValue] = diffList[index];
      if (preOperate !== diff.INSERT) {
        const matches = preValue.match(/\n.*$/);
        if (matches) {
          return matches[0] + result ;
        } else {
          result = preValue + result;
        }
      }
    }
    return result;
  }
}


function getKeyValue(diffList, index) {
  const [operate, value] = diffList[index];
  if (value.match(/:/)) {

  } else {
      return getPrev(diffList, index) + value + getNext(diffList, index);
  }
}
function getMatch(diffList, index) {
  const value = diffList[index];
  if (value) {

  }

}
function getPrev(diffList, index){
  const value = diffList[index];
  console.log(value)


}
function getNext(diffList, index){

}

function hasColon(value) {
  return value.indexOf(':') >= 0;
}

function getNextLineFlag(diffList, index, reverse){
  const [operate, value] = diffList[index];
  if (value.match(endLineFlag)) {
    return '';
  } else {
    const length = diffList.length;
    let result = '';
    while (++index < length) {
      let [nextOperate, nextValue] = diffList[index];
      if (nextOperate !== (reverse ? diff.DELETE : diff.INSERT)) {
        const matches = nextValue.match(/^.*\n/);
        if (matches) {
          return result + matches[0];
        } else {
          result = result + nextValue;
        }
      }
    }
    return result;
  }
}
