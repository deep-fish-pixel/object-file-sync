const { readFile } = require('../utils/cacheFile');
/**
 * 获取文件内容的前后值
 * @returns {[(Promise<boolean|*>|Promise<T>), (Promise<boolean|*>|Promise<T>)]}
 */
module.exports = function (file){
  return [readFile(file), readFile(file, true)]
}
