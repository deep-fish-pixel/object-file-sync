const { readFile } = require('../utils/cacheFile');
/**
 * 获取文件内容的前后值
 * @returns {[(Promise<boolean|*>|Promise<T>), (Promise<boolean|*>|Promise<T>)]}
 */
function getFileContents(file){
  return [readFile(file), readFile(file, true)]
}

/**
 * 获取多个文件的内容
 * @param files
 * @returns {*}
 */
function getFilesContents(files){
  return files.map(file => readFile(file))
}

module.exports = {
  getFileContents,
  getFilesContents,
}
