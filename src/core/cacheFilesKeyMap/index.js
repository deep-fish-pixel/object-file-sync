const CacheDirsKeyMap = require('./CacheDirsKeyMap');

Object.assign(module.exports, {
  singletonKeyMap: null,
  createSingletonKeyMap(dirs){
    this.singletonKeyMap = new CacheDirsKeyMap(dirs)
  },
  getSingletonCacheKeyMap() {
    return this.singletonKeyMap;
  }
});

