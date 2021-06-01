const CacheDirsKeyMap = require('./CacheDirsKeyMap');

let singletonKeyMap = null;

function createSingletonKeyMap(dirs){
  if (!singletonKeyMap) {
    singletonKeyMap = new CacheDirsKeyMap(dirs)
  }
}

function getSingletonCacheKeyMap() {
  return singletonKeyMap;
}

function addSingletonDirMapCache(dir) {
  singletonKeyMap.addDirMapCache(dir);
}

function removeSingletonDirMapCache(dir) {
  singletonKeyMap.removeDirMapCache(dir);
}

module.exports = {
  createSingletonKeyMap,
  getSingletonCacheKeyMap,
  addSingletonDirMapCache,
  removeSingletonDirMapCache,
};

