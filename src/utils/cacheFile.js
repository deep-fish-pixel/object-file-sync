const fse = require('fs-extra');
const { getRelativeDir } = require('./moduleOptions');
const { error } = require('./log');
const CacheFilesKeyMap = require('../core/cacheFilesKeyMap');

const cacheFileMap = new Map();

module.exports = {
  /**
   * 获取文件内容并缓存
   * @param file
   * @param noCache
   * @returns {Promise<boolean|any>|Promise<T>}
   */
  getFile(file, noCache) {
    const content = noCache ? false : cacheFileMap.get(file);
    if (content) {
      return Promise.resolve(content);
    } else {
      return Promise.resolve(fse.readFileSync(file, 'utf8')).then((content) => {
        // 缓存文件
        cacheFileMap.set(file, content);
        // 缓存文件的键值
        CacheFilesKeyMap.getSingletonCacheKeyMap().addFileCache(file, content);
        return content;
      }).catch((e) => {
        error(`[读取文件失败]不存在该文件: ${getRelativeDir(file)}`);
        return false;
      });
    }
  },
  /**
   * 写入文件内容并缓存
   * @param file
   * @param content
   * @returns {Promise<T>}
   */
  writeFile(file, content) {
    // debugger
    // 先缓存内容
    cacheFileMap.set(file, content);
    console.log('writeFile===============1', file, content);
    // 缓存文件的键值
    CacheFilesKeyMap.getSingletonCacheKeyMap().addFileCache(file, content);
    return Promise.resolve(fse.writeFileSync(file, content)).then(() => {
      return content;
    }).catch((e) => {
      error(`[写入文件失败] ${getRelativeDir(file)} ${e.message}`);
      return false;
    })
  },
};
