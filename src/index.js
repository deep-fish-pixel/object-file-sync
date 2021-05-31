/**
 * 监控文件夹
 */
const path = require('path')
const chokidar = require('chokidar');
const {
  setAutoImportOptions,
  addFileImport,
  addDirImport,
  removeFileImport,
  removeDirImport
} = require('auto-import-module');
const {
  addFileSync,
  removeFileSync,
  changeFileSync
} = require('./core/fileOperate');
const { setModuleOptions } = require('./utils/moduleOptions');
const CacheFilesKeyMap = require('./core/cacheFilesKeyMap');
const getSyncDirs = require('./core/getSyncDirs');

module.exports = function (options = {}) {
  options = Object.assign({
    root: '',
    dirs: [],
  }, options);
  getSyncDirs(options.root, options.dirs).then(dirs => {
    Object.assign(options, {
      // 同步目录共同的根目录。可不配置，但root与dirs至少有一个有效配置
      root: options.root,
      // 保持并行同步的目录。可不配，但root与dirs至少有一个有效配置
      dirs,
      // 创建目录的默认入口index文件的后缀名
      extension: options.defaultIndexExtension || '.js',
      // 自动引用目录模块
      autoImportModule: true,
    });
    setAutoImportOptions({
      root: path.join(options.root, '/'),
      extension: options.defaultIndexExtension || '.js',
    });
    setModuleOptions(options);
    CacheFilesKeyMap.createSingletonKeyMap(options.dirs);

    const watcher = chokidar.watch(options.root, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    watcher
      .on('add', path => {
        options.autoImportModule && addFileImport(path);
        addFileSync(path);
      })
      .on('change', path => {
        changeFileSync(path);
      })
      .on('unlink', path => {
        options.autoImportModule && removeFileImport(path);
        removeFileSync(path);
      })
      .on('addDir', path => {
        options.autoImportModule && addDirImport(path);
        addFileSync(path);
      })
      .on('unlinkDir', path => {
        options.autoImportModule && removeDirImport(path);
        removeFileSync(path);
      });
  });
}

Object.assign(module.exports, {
  addFileSync,
  changeFileSync,
  removeFileSync
})
