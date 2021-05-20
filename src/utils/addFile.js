const path = require('path');
const fse = require('fs-extra')
const cacheFilter = require("./cacheFilter");
const { success, error } = require("./log");
const { getModuleOptions } = require('./moduleOptions');
const { Operate_File_Add, Operate_File_Delete }  = require('./constants');

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
  return dir.replace(dir, root);
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

/**
 * 同步目录文件
 * @param target
 * @param dist
 */
function syncDir(target, dist, operate) {
  console.log('=======2');
  fse.pathExists(dist)
    .then(exists => {
      console.log('=======3', target, dist, exists);
      if (exists && operate === Operate_File_Delete) {
        console.log('=======4');
        fse.remove(dist)
          .then(() => {
            success(`文件同步 删除成功: ${getRelativeDir(dist)}`)
          })
          .catch(err => {
            console.error(err)
          })
      } else if (!exists && operate === Operate_File_Add) {
        console.log('=======5');
        fse.copy(target, dist)
          .then(() => success(`文件同步 添加成功: ${getRelativeDir(target)}`))
          .catch(err => error(err))
      }
    });
}


Object.assign(module.exports, {
  addFile,
  removeFile,
});
