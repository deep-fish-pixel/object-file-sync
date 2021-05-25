const path = require('path');
const fse = require('fs-extra')
const cacheFilter = require("../utils/cacheFilter");
const { success } = require("../utils/log");
const { getModuleOptions } = require('../utils/moduleOptions');
const fileReplace = require('./fileReplace');
const { getFile } = require("../utils/cacheFile");
const {
  Operate_File_Add,
  Operate_File_Change,
  Operate_File_Delete
}  = require('../utils/constants');

function getSyncDirs(file, operate) {
  const { dirs } = getModuleOptions();
  const syncDirs = [];
  let relativeDir;
  dirs.forEach(dir => {
    if (file.indexOf(dir) === -1) {
      syncDirs.push(dir);
    } else {
      relativeDir = file.replace(dir, '');
      if (!dir || !relativeDir) {
        console.log(file, dir, relativeDir);
      }
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


function getRelativeDir(dir){
  const { root } = getModuleOptions();
  return dir.replace(root, '');
}
/**
 * 添加默认入口文件index
 * @param dir
 */
function addFile(dir) {
  getSyncDirs(dir, Operate_File_Add).forEach((dist) => {
    syncDir(dir, dist, Operate_File_Add);
  });
}

function removeFile(dir) {
  getSyncDirs(dir, Operate_File_Delete).forEach((dist) => {
    syncDir(dir, dist, Operate_File_Delete);
  });
}

function changeFile(dir) {
  getSyncDirs(dir, Operate_File_Change).forEach((dist) => {
    syncDir(dir, dist, Operate_File_Change);
  });
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
        fse.removeSync(dist)
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


Object.assign(module.exports, {
  addFile,
  changeFile,
  removeFile,
});
