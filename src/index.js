/**
 * 监控文件夹
 */
const path = require('path')
const chokidar = require('chokidar');
const addImport = require('./utils/addImport');
const { addFile, removeFile, changeFile } = require('./core/fileOperate');
const { setModuleOptions } = require('./utils/moduleOptions');
const CacheFilesKeyMap = require('./core/cacheFilesKeyMap');
const getSyncDirs = require('./core/getSyncDirs');
const directory = require("./utils/directory");

module.exports = function (options = {}) {
  options = Object.assign({
    root: '',
    dirs: [],
  }, options);
  getSyncDirs(options.root, options.dirs).then(dirs => {
    Object.assign(options, {
      // 同步目录共同的根目录。可不配置，但root与dirs至少有一个有效配置
      root: path.join(options.root, '/'),
      // 保持并行同步的目录。可不配，但root与dirs至少有一个有效配置
      dirs,
      // 创建目录的默认入口index文件的后缀名
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
        directory.add(path);
        addFile(path);
        addImport(path);
      })
      .on('change', path => {
        changeFile(path);
      })
      .on('unlink', path => {
        directory.remove(path);
        removeFile(path);
        addImport(path);
      })
      .on('addDir', path => {
        directory.add(path);
        addFile(path);
        addImport(path);
      })
      .on('unlinkDir', path => {
        directory.remove(path);
        removeFile(path);
        addImport(path);
      });
  });
}

Object.assign(module.exports, {
  directory,
  addFile,
  addImport,
  changeFile,
  removeFile,
})
