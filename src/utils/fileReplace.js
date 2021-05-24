const diff = require('fast-diff');
const { getFile, writeFile } = require("./cacheFile");

module.exports = function fileReplace(target, dist) {
  Promise.all([getFile(target, true), getFile(dist)])
    .then(([targetContent, distContent]) => {
      // console.log(target, dist);
      // console.log(diff(targetContent, distContent, 1));
      const diffList = splitLine(diff(targetContent, distContent, 1));
      console.log(diffList)
      let distValue = '';
      diffList.forEach(([operate, value], index) => {
        switch (operate) {
          case diff.EQUAL:
            distValue += value;
            break;
          case diff.INSERT:
            debugger
            const { isValue: isInsertValue } = getLine(diffList, index);
            if (isInsertValue) {
              distValue += value;
            }
            break;
          case diff.DELETE:
            debugger
            const { isValue: isDeleteValue } = getLine(diffList, index, true);
            if (!isDeleteValue) {
              distValue += value;
            }
            break;
          default:
            distValue += '';
          /*case diff.DELETE:*/
        }
        /*if (operate === diff.DELETE ) {
          const newValue = getLine(diffList, index);
          if (isKeyValues(newValue)) {

          }
        }*/
      });
      console.log(distValue)
      // writeFile(dist, distValue);
    });
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
