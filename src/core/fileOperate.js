const path = require('path');
const fse = require('fs-extra')
const cacheFilter = require("./cacheFilter");
const { success } = require("../utils/log");
const { getModuleOptions, getRelativeDir } = require('../utils/moduleOptions');
const fileReplace = require('./fileReplace');
const { getFile } = require("../utils/cacheFile");
const CacheFilesKeyMap = require('./cacheFilesKeyMap');

const {
  Operate_File_Add,
  Operate_File_Change,
  Operate_File_Delete
}  = require('./constants/fileOperate');

function getSyncDirs(file, operate) {
  const { dirs } = getModuleOptions();
  const syncDirs = [];
  let relativeDir;
  dirs.forEach(dir => {
    if (file.indexOf(dir) === -1) {
      syncDirs.push(dir);
    } else {
      relativeDir = file.replace(dir, '');
    }
  });
  if (!relativeDir) {
    return [];
  }
  const absoluteDirs = syncDirs.map(dir => {
    return path.join(dir, relativeDir);
  });
  cacheFilter([file], operate);
  return cacheFilter(absoluteDirs, operate);
}

/**
 * 同步目录文件
 * @param target
 * @param dist
 */
function syncDir(target, dist, operate) {
  fse.pathExists(dist)
    .then(exists => {
      if (operate === Operate_File_Add) {
        if (!exists) {
          fse.copySync(target, dist);
          success(`[文件同步]复制成功: ${getRelativeDir(target)}`);
        }
        // 读取文件内容，以便做第一次修改的对比处理
        getFile(target);
        getFile(dist);
      }
      else if (exists && operate === Operate_File_Delete) {
        fse.removeSync(dist);
        CacheFilesKeyMap.getSingletonCacheKeyMap().clearFileCache(dist);
        success(`[文件同步]删除成功: ${getRelativeDir(dist)}`)
      } else if (operate === Operate_File_Change) {
        if (exists) {
          fileReplace(target, dist);
        } else {
          fse.copy(target, dist);
        }
        success(`[文件同步]修改成功: ${getRelativeDir(target)}`)
      }
    });
}

/**
 * 添加文件
 * @param dir
 */
function addFile(dir) {
  getSyncDirs(dir, Operate_File_Add).forEach((dist) => {
    syncDir(dir, dist, Operate_File_Add);
  });
}
/**
 * 删除文件
 * @param dir
 */
function removeFile(dir) {
  getSyncDirs(dir, Operate_File_Delete).forEach((dist) => {
    syncDir(dir, dist, Operate_File_Delete);
  });
}
/**
 * 修改文件
 * @param dir
 */
function changeFile(dir) {
  getSyncDirs(dir, Operate_File_Change).forEach((dist) => {
    syncDir(dir, dist, Operate_File_Change);
  });
}


Object.assign(module.exports, {
  addFile,
  changeFile,
  removeFile,
});
