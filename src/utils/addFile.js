const path = require('path');
const fse = require('fs-extra')
const cacheFilter = require("./cacheFilter");
const { success, error } = require("./log");
const { getModuleOptions } = require('./moduleOptions');
const fileReplace = require('./fileReplace');
const {
  Operate_File_Add,
  Operate_File_Change,
  Operate_File_Delete
}  = require('./constants');

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
  console.log('changeFile')
  debugger
  getSyncDirs(dir, Operate_File_Change).forEach((dist) => {
    console.log('getSyncDirs')
    syncDir(dir, dist, Operate_File_Change);
  });
}

/**
 * 同步目录文件
 * @param target
 * @param dist
 */
function syncDir(target, dist, operate) {
  console.log('operate', operate)
  fse.pathExists(dist)
    .then(exists => {
      // console.log('=======3', target, dist, exists);
      if (!exists && operate === Operate_File_Add) {
        fse.copySync(target, dist)
        success(`[文件同步]复制成功: ${getRelativeDir(target)}`)
      }
      else if (exists && operate === Operate_File_Delete) {
        fse.removeSync(dist)
        success(`[文件同步]删除成功: ${getRelativeDir(dist)}`)
      } else if (operate === Operate_File_Change) {
        if (exists) {
          fileReplace(target, dist)
        } else {
          fse.copy(target, dist)
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
