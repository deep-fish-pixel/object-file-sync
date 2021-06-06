const fse = require('fs-extra');
const path = require('path');
const { success, error } = require('console-log-cmd');
const {getModuleOptions, getRelativeDir} = require('../../utils/moduleOptions');
const { readFile, writeFile } = require('../../utils/cacheFile');
const cacheFile = require('../utils/cache/cacheFile');

/**
 * 移动key到指定文件
 * @param relativeDir
 * @param rootSubDir
 * @param rootDirSubFile
 * @param keyValuePathList
 */
function removeKeyToFile(
  { relativeDir, rootSubDir, rootDirSubFile, }, keyValuePathList) {
  const { root, extension } = getModuleOptions();
  const projectConfig = {
    syncTabWidth: 2,
    syncQuotes: '\'',
  };
  const moduleExports = 'export default';
  cacheFile.clearAll();
  keyValuePathList.forEach(keyValuePathes => {
    const { key, keyValue, pathes, } = keyValuePathes;
    const newFile = path.join(root, rootSubDir, `${pathes.join('/').replace(/\/[^\/]+$/, '')}${extension}`);
    let cacheValue = cacheFile.get(newFile);
    if (!cacheValue) {
      const exist = fse.existsSync(newFile);
      if(exist){
        readFile(newFile).then((content) => {
          cacheFile.set(newFile, cacheValue = {
            content,
            keys: [],
          });
        });
      }
    }
    if (cacheValue) {
      const { content, keys } = cacheValue;
      let result;
      let replacedFirst = false,
        replacedSecond = false;
        // 进行key值替换, 为了配合国际化更新的一个文件，方便覆盖
      result = content.replace(new RegExp(`([^\\n]*['"]?${key}+['"]?\\s*:\\s*)([^\\n]*)(\\s*,?\\s*\\n)`, 'g'), (all, $1, value, $3) => {
        const valueReplace = value.replace(/^(['"])(.*)(['"])/, (all, $1, value, $3) => `${$1}${keyValue}${$3}`);
        replacedFirst = true;
        return `${$1}${valueReplace}${$3}`;
      });
      if (!replacedFirst) {
        result = content.replace(/([{,]?)(\s*)(}.*\s*)$/, (all, $1, $2, $3) => {
          replacedSecond = true;
          return `${$1||','}${$2.match(/\\n/) ? $2 : '\n'}${createKeyValue(key, keyValue, projectConfig)}${$3}`;
        });
        if (!replacedSecond) {
          if (content.indexOf(moduleExports) === -1) {
            result += moduleExports;
          }
          result = result + ` {\n${createKeyValue(key, keyValue, projectConfig)}};`;
        }
      }
      keys.push(key);
      cacheFile.set(newFile, {
        content: result,
        keys,
      });
    } else {
      cacheFile.set(newFile, {
        content: `${moduleExports} {\n${createKeyValue(key, keyValue, projectConfig)}};`,
        keys: [ key ],
      });
    }
  });
  cacheFile.forEach(({ content, keys }, newFile) => {
    fse.ensureDirSync(newFile.replace(/\/[^\/]+$/, ''));
    writeFile(newFile, content).then(result => {
      if (result === false) {
        error(`[文件同步] 添加Key 失败: ${getRelativeDir(newFile)}`);
      } else {
        success(`[文件同步] 添加Key 成功: ${getRelativeDir(newFile)}`);
      }
    });
  })

}

function createKeyValue(key, value, { syncTabWidth, syncQuotes }) {
  return `${createTabWith(syncTabWidth)}${syncQuotes}${key}${syncQuotes}: ${syncQuotes}${value}${syncQuotes}\n`;
}

function createTabWith(count) {
  return new Array(count + 1).join(' ');
}

module.exports = removeKeyToFile;
