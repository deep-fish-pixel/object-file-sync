/**
 * 监控文件夹
 */
const path = require('path')
const chokidar = require('chokidar');
const { addFile, removeFile } = require('./utils/addFile');
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
    .on('unlink', path => {
      directory.remove(path);
      removeFile(path);
    })
    .on('addDir', path => {
      directory.add(path);
      addFile(path);
    })
    .on('unlinkDir', path => {
      directory.remove(path);
      removeFile(path);
    });
}
