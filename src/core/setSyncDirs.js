const path = require('path');
const {getModuleOptions} = require('../utils/moduleOptions');
const CacheFilesKeyMap = require('./cacheFilesKeyMap');

module.exports = function (dir, isRemove) {
  const { root, dirs, _limitDirs } = getModuleOptions();
  if (!_limitDirs && dir.replace(path.join(root, '/'), '').match(/^[\w-]+$/)) {
    if (isRemove) {
      const newDirs = [...dirs];
      dirs.splice(0);
      newDirs.forEach(newDir => {
        if (newDir !== dir) {
          dirs.push(newDir);
        }
      })
      CacheFilesKeyMap.removeSingletonDirMapCache(dir);
    } else {
      dirs.push(dir);
      CacheFilesKeyMap.addSingletonDirMapCache(dir);
    }
  }
}
