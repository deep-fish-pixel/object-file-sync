const CacheDirKeyMap = require("./CacheDirKeyMap");
const {File_Key_Value_Validate} = require("../constants/logMessage");
const {getRelativeDir} = require("../../utils/moduleOptions");
const { error } = require("../../utils/log");

function CacheDirsKeyMap(dirs) {
  this.cacheDirMap = new Map();
  this.dirs = dirs;
  this.dirs.forEach( dir => {
    this.cacheDirMap.set(dir, new CacheDirKeyMap(dir));
  });
}

/**
 * 缓存文件，内部根据dir分发到对应的cache缓存
 * @param file
 * @param content
 */
CacheDirsKeyMap.prototype.addFileCache = function (file, content) {
  const dirCache = this.getDirCache(file);
  if (dirCache) {
    dirCache.addFileCache(file, content);
  } else {
    error(File_Key_Value_Validate, getRelativeDir(file));
  }
}

CacheDirsKeyMap.prototype.getValue = function (dir, key) {
  const dirCache = this.getDirCache(dir);
  if (dirCache) {
    return dirCache.getValue(key);
  } else {
    error(File_Key_Value_Validate, getRelativeDir(dir));
  }
}

CacheDirsKeyMap.prototype.hasKey = function (dir, key) {
  const dirCache = this.getDirCache(dir);
  if (dirCache) {
    return dirCache.hasKey(key);
  } else {
    error(File_Key_Value_Validate, getRelativeDir(dir));
  }
}

CacheDirsKeyMap.prototype.clearFileCache = function (file) {
  const dirCache = this.getDirCache(file);
  if (dirCache) {
    return dirCache.clearFileCache(file);
  } else {
    error(File_Key_Value_Validate, getRelativeDir(dir));
  }
}

CacheDirsKeyMap.prototype.getDirCache = function (file) {
  let someDir;
  this.dirs.some(dir => {
    return file.indexOf(dir) === 0 && (someDir = dir);
  })
  return someDir && this.cacheDirMap.get(someDir);
}

CacheDirsKeyMap.prototype.addDir = function (file) {

}

module.exports = CacheDirsKeyMap;
