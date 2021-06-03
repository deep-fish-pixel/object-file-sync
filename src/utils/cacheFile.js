const { readFile, writeFile } = require('cache-io-disk');
const CacheFilesKeyMap = require('../core/cacheFilesKeyMap');

module.exports = {
  /**
   * 获取文件内容并缓存
   * @param file
   * @param noCache
   * @returns {Promise<boolean|any>|Promise<T>}
   */
  readFile(file, noCache) {
    return readFile(file, noCache).then((content => {
      if (content !== false) {
        CacheFilesKeyMap.getSingletonCacheKeyMap().addFileCache(file, content);
      }
      return content;
    }));
  },
  /**
   * 写入文件内容并缓存
   * @param file
   * @param content
   * @returns {Promise<T>}
   */
  writeFile(file, content) {
    CacheFilesKeyMap.getSingletonCacheKeyMap().addFileCache(file, content);
    return writeFile(file, content);
  },
};
