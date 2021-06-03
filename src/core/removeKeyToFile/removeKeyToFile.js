const fse = require('fs-extra');
const path = require('path');
const { success, error } = require('console-log-cmd');
const CacheFilesKeyMap = require('../cacheFilesKeyMap');
const {getModuleOptions, getRelativeDir} = require('../../utils/moduleOptions');
const { readFile, writeFile } = require('../../utils/cacheFile');

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
  debugger
  keyValuePathList.forEach(keyValuePathes => {
    const { key, keyValue, pathes, } = keyValuePathes;
    const newFile = path.join(root, rootSubDir, `${pathes.join('/').replace(/\/[^\/]+$/, '')}${extension}`);
    const exist = fse.existsSync(newFile);
    if (exist) {
      readFile(newFile).then((content) => {
        let hasCurlyBrace = false;
        let result = content.replace(/([{,]?)(\s*)(}.*\s*)$/, (all, $1, $2, $3) => {
          hasCurlyBrace = true;
          return `${$1||','}${$2.match(/\\n/) ? $2 : '\n'}${createKeyValue(key, keyValue, projectConfig)}${$3}`;
        });
        if (!hasCurlyBrace) {
          if (content.indexOf(moduleExports) === -1) {
            result += moduleExports;
          }
          result = result + ` {\n${createKeyValue(key, keyValue, projectConfig)}};`;
        }

        // 判断文件不包含该值后 添加
        if(!CacheFilesKeyMap.getSingletonCacheKeyMap().hasKeyByFile(newFile, key)){
          writeFile(newFile, result).then(result => {
            if (result === false) {
              error(`[文件同步] 添加Key ${key} 失败: ${getRelativeDir(newFile)}`);
            } else {
              success(`[文件同步] 添加Key ${key} 成功: ${getRelativeDir(newFile)}`);
            }
          });
        }
      });
    } else {
      fse.ensureDirSync(newFile.replace(/\/[^\/]+$/, ''));

      writeFile(newFile, `${moduleExports} {\n${createKeyValue(key, keyValue, projectConfig)}};`).then(result => {
        if (result === false) {
          error(`[文件同步] 添加Key ${key} 失败: ${getRelativeDir(newFile)}`);
        } else {
          success(`[文件同步] 添加Key ${key} 成功: ${getRelativeDir(newFile)}`);
        }
      });
    }
  });
}

function createKeyValue(key, value, { syncTabWidth, syncQuotes }) {
  return `${createTabWith(syncTabWidth)}${syncQuotes}${key}${syncQuotes}: ${syncQuotes}${value}${syncQuotes}\n`;
}

function createTabWith(count) {
  return new Array(count + 1).join(' ');
}

module.exports = removeKeyToFile;
