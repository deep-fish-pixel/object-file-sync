const path = require('path');
/**
 * 缓存配置，单例
 */
const _options = {
  dir: '',
  extension: '',
  importModuleOnly: false,
};

function getModuleOptions(){
  return _options;
}

function setModuleOptions(options) {
  Object.assign(_options, options);
}

/**
 * 获取相对root的相对路径
 * @param dir
 * @returns {*}
 */
function getRelativeDir(dir) {
  const { root } = getModuleOptions();
  return dir.replace(path.join(root.replace(/\/[\w-]+\/?$/, ''), '/'), '');
}

/**
 * 获取相对模块相对路径
 * @param dir
 * @returns {{rootDirSubFile: *, rootSubDir: *, relativeDir}}
 */
function getModulePath(dir) {
  const relativeDir = getRelativeDir(dir);
  const [ all, rootSubDir, rootDirSubFile ] = relativeDir.match(/[^/]+\/([^/]+)\/(.*)$/) || [];
  return {
    relativeDir,
    rootSubDir,
    rootDirSubFile,
  };
}

module.exports = {
  getModuleOptions,
  setModuleOptions,
  getRelativeDir,
  getModulePath
};
