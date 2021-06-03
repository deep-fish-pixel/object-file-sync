const fse = require('fs-extra');
const { error } = require('console-log-cmd');
const { getRelativeDir } = require('./moduleOptions');
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
      const content = fse.readFileSync(file, 'utf8');
      // 缓存文件
      cacheFileMap.set(file, content);
      // 缓存文件的键值
      CacheFilesKeyMap.getSingletonCacheKeyMap().addFileCache(file, content);
      return Promise.resolve(content).then((content) => {
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
    if(fse.existsSync(file)){
      const originalContent = fse.readFileSync(file, 'utf8');
      // 解决重复写入导致编辑器重新加载
      if (originalContent === content) {
        return Promise.resolve(content);
      }
    }
    // 先缓存内容
    cacheFileMap.set(file, content);
    // 缓存文件的键值
    CacheFilesKeyMap.getSingletonCacheKeyMap().addFileCache(file, content);
    fse.writeFileSync(file, content)

    return Promise.resolve(content).catch((e) => {
      error(`[写入文件失败] ${getRelativeDir(file)} ${e.message}`);
      return false;
    })
  },
};
