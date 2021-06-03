const { getModuleOptions } = require('../utils/moduleOptions');
const setSyncDirs = require('../core/setSyncDirs');
const {syncDir, getSyncDirs} = require('./syncDir');
const getFileContents = require('./getFileContents');
const {
  addFileImport,
  addDirImport,
  removeFileImport,
  removeDirImport,
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
  // 先获取文件的新旧内容
  const fileContents = getFileContents(file);
  getSyncDirs(file, Operate_File_Add).forEach((dist) => {
    syncDir(file, dist, Operate_File_Add, false, fileContents);
  });
}


/**
 * 添加目录
 * @param dir
 */
function addDirSync(dir) {
  setSyncDirs(dir, false);
  if (getModuleOptions().autoImportModule) {
    addDirImport(dir);
  }
  getSyncDirs(dir, Operate_File_Add).forEach((dist) => {
    syncDir(dir, dist, Operate_File_Add, true);
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
    syncDir(file, dist, Operate_File_Delete, false);
  });
}

/**
 * 删除目录
 * @param dir
 */
function removeDirSync(dir) {
  setSyncDirs(dir, true);
  if (getModuleOptions().autoImportModule) {
    removeDirImport(dir);
  }
  getSyncDirs(dir, Operate_File_Delete).forEach((dist) => {
    syncDir(dir, dist, Operate_File_Delete, true);
  });
}

/**
 * 修改文件
 * @param dir
 */
function changeFileSync(file) {
  // 先获取文件的新旧内容
  const fileContents = getFileContents(file);
  getSyncDirs(file, Operate_File_Change).forEach((dist) => {
    syncDir(file, dist, Operate_File_Change, false, fileContents);
  });
}


module.exports = {
  addFileSync,
  addDirSync,
  changeFileSync,
  removeFileSync,
  removeDirSync,
};
