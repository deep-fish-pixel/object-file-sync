/**
 * 监控文件夹
 */
const path = require('path')
const chokidar = require('chokidar');
const addImport = require('./utils/addImport');
const { addFile, removeFile, changeFile } = require('./core/fileOperate');
const { setModuleOptions } = require('./utils/moduleOptions');
const CacheFilesKeyMap = require('./core/cacheFilesKeyMap');
const directory = require("./utils/directory");

module.exports = function (options = {}) {
  options = Object.assign({
    root: path.join(process.cwd(), 'test/locales'),
    dirs: ['zh-CN', 'en-US'],
    includes: ['.js'],
    excludes: ['.js'],
  }, options);
  options.dirs = options.dirs.map(dir => path.join(options.root, dir, '/'));
  options.root = path.join(options.root, '/');

  setModuleOptions(options);
  CacheFilesKeyMap.createSingletonKeyMap(options.dirs);


  const watcher = chokidar.watch(options.dir, {
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
      console.log('Initial scan complete. Ready for changes')
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
    // .on('ready', () => console.log('Initial scan complete. Ready for changes'))
    .on('unlinkDir', path => {
      directory.remove(path);
      removeFile(path);
      addImport(path);
    });
}
