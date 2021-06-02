/**
 * 监控文件夹
 */
const chokidar = require('chokidar');
const {
  addFileSync,
  addDirSync,
  changeFileSync,
  removeFileSync,
  removeDirSync,
} = require('./core/fileOperate');
const setSyncOptions = require('./core/setSyncOptions');
const { exportModuleTypes, } = require('auto-import-module');

module.exports = function (options = {}) {
  options = Object.assign({
    // 同步目录共同的根目录。
    root: '',
    // 保持并行同步的目录。可不配置，根据root自动生成
    dirs: [],
    // 创建目录的默认入口index文件的后缀名
    extension: options.extension || '.js',
    // 自动引用目录模块
    autoImportModule: true,
    autoImportExportModuleTypeDefault: exportModuleTypes.SPREAD_MODULE,
    autoImportExportModuleTypes: {},
    // 修改配置key的回调
    changeKeyHandle: null,
    // 键映射配置
    keyMap: null,
    // 设置key文件位置的分割符，为空表示不分离
    setKeyToFileSeperator: '.',
  }, options);
  setSyncOptions(options);

  const watcher = chokidar.watch(options.root, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });

  watcher
    .on('add', path => {
      addFileSync(path);
    })
    .on('change', path => {
      changeFileSync(path);
    })
    .on('unlink', path => {
      removeFileSync(path);
    })
    .on('addDir', path => {
      addDirSync(path);
    })
    .on('unlinkDir', path => {
      removeDirSync(path);
    });
}

Object.assign(module.exports, {
  setFileSyncOptions: setSyncOptions,
  addFileSync,
  changeFileSync,
  removeFileSync,
  addDirSync,
  removeDirSync,
})
