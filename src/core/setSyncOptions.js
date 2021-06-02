const path = require('path');
const { setAutoImportOptions, } = require('auto-import-module');
const { setModuleOptions } = require('../utils/moduleOptions');
const CacheFilesKeyMap = require('./cacheFilesKeyMap');

/**
 * 设置初始化配置
 * @param options
 */
module.exports = function (options) {
  setAutoImportOptions({
    root: path.join(options.root, '/'),
    extension: options.extension || '.js',
    exportModuleTypeDefault: options.autoImportExportModuleTypeDefault,
    exportModuleTypes: options.autoImportExportModuleTypes,
  });
  setModuleOptions(options);
  CacheFilesKeyMap.createSingletonKeyMap(options.dirs);
  options._limitDirs = !!(options.dirs && options.dirs.length);
}
