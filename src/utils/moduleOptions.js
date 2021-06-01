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

function getRelativeDir(dir) {
  const { root } = getModuleOptions();
  return dir.replace(path.join(root.replace(/\/[\w-]+\/?$/, ''), '/'), '');
}

module.exports = {
  getModuleOptions,
  setModuleOptions,
  getRelativeDir
};
