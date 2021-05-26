const fse = require('fs-extra');
const { getRelativeDir } = require("./moduleOptions");
const { error } = require("./log");
const CacheFilesKeyMap = require('../core/cacheFilesKeyMap');

const cache = new Map();

module.exports = {
  getFile(file, noCache) {
    const content = noCache ? false : cache.get(file);
    if (content) {
      return Promise.resolve(content);
    } else {
      return fse.readFile(file, 'utf8').then((content) => {
        // 缓存文件
        cache.set(file, content);
        // 缓存文件的键值
        CacheFilesKeyMap.getSingletonCacheKeyMap().addFileCache(file, content);
        return content;
      }).catch((e) => {
        console.log(e)
        error(`[读取文件失败]不存在该文件: ${getRelativeDir(file)}`)
      });
    }
  },
  writeFile(file, content) {
    return fse.writeFile(file, content).then((content) => {
      // 缓存文件
      cache.set(file, content);
      // 缓存文件的键值
      CacheFilesKeyMap.getSingletonCacheKeyMap().addFileCache(file, content);
      return content;
    }).catch((e) => {
      console.log(e)
      error(`[写入文件失败] ${getRelativeDir(file)} ${e.message}`)
    })
  },
};
