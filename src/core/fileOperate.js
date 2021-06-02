const { getModuleOptions } = require('../utils/moduleOptions');
const setSyncDirs = require('../core/setSyncDirs');
const {syncDir, getSyncDirs} = require('./syncDir');
const {
  addFileImport,
  removeFileImport,
} = require('auto-import-module');

const {
  Operate_File_Add,
  Operate_File_Change,
  Operate_File_Delete
}  = require('./constants/fileOperate');

/**
 * 添加文件
 * @param file
 */
function addFileSync(file) {
  if (getModuleOptions().autoImportModule) {
    addFileImport(file);
  }
  getSyncDirs(file, Operate_File_Add).forEach((dist) => {
    syncDir(file, dist, Operate_File_Add);
  });
}


/**
 * 添加文件目录
 * @param dir
 */
function addDirSync(dir) {
  setSyncDirs(dir, false);
  if (getModuleOptions().autoImportModule) {
    addFileImport(dir);
  }
  getSyncDirs(dir, Operate_File_Add).forEach((dist) => {
    syncDir(dir, dist, Operate_File_Add);
  });
}

/**
 * 删除文件
 * @param file
 */
function removeFileSync(file) {
  if (getModuleOptions().autoImportModule) {
    removeFileImport(file);
  }
  getSyncDirs(file, Operate_File_Delete).forEach((dist) => {
    syncDir(file, dist, Operate_File_Delete);
  });
}

/**
 * 删除文件目录
 * @param dir
 */
function removeDirSync(dir) {
  setSyncDirs(dir, true);
  if (getModuleOptions().autoImportModule) {
    removeFileImport(dir);
  }
  getSyncDirs(dir, Operate_File_Delete).forEach((dist) => {
    syncDir(dir, dist, Operate_File_Delete);
  });
}

/**
 * 修改文件
 * @param dir
 */
function changeFileSync(dir) {
  getSyncDirs(dir, Operate_File_Change).forEach((dist) => {
    console.log('changeFileSync==========1', dist)
    syncDir(dir, dist, Operate_File_Change);
  });
}


module.exports = {
  addFileSync,
  addDirSync,
  changeFileSync,
  removeFileSync,
  removeDirSync,
};
