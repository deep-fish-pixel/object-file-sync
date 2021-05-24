/**
 * 监控文件夹
 */
const path = require('path')
const chokidar = require('chokidar');
const { addFile, removeFile, changeFile } = require('./utils/addFile');
const { setModuleOptions } = require('./utils/moduleOptions');
const directory = require("./utils/directory");

module.exports = function (options = {}) {
  options = Object.assign({
    root: path.join(process.cwd(), 'test/temp'),
    dirs: ['test', 'test2', 'test3', 'test4'],
    includes: ['.js'],
    excludes: ['.js'],
  }, options);
  options.dirs = options.dirs.map(dir => path.join(options.root, dir, '/'));
  options.root = path.join(options.root, '/');

  setModuleOptions(options);

  const watcher = chokidar.watch(options.dir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });

  watcher
    .on('add', path => {
      directory.add(path);
      addFile(path);
    })
    .on('change', path => {
      console.log('Initial scan complete. Ready for changes')
      changeFile(path);
    })
    .on('unlink', path => {
      directory.remove(path);
      removeFile(path);
    })
    .on('addDir', path => {
      directory.add(path);
      addFile(path);
    })
    // .on('ready', () => console.log('Initial scan complete. Ready for changes'))
    .on('unlinkDir', path => {
      directory.remove(path);
      removeFile(path);
    });
}
