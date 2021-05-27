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

module.exports = {
  createSingletonKeyMap,
  getSingletonCacheKeyMap,
};

