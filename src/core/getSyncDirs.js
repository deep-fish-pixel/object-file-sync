const path = require('path');
const fse = require('fs-extra');

module.exports = function (syncDirRoot, syncDirs) {
  if (syncDirs && syncDirs.length) {
    return Promise.resolve(syncDirs.map(dir => {
      if (dir.match(/^\//)) {
        return path.join(dir, '/');
      } else if(syncDirRoot) {
        return path.join(syncDirRoot, dir, '/');
      }
    }));
  } else if (syncDirRoot) {
    return fse.readdir(syncDirRoot).then(dirs => {
      return dirs.map(dir => {
        return path.join(syncDirRoot, dir)
      }).filter(dir => {
        if (!dir.match(/\/\.[\w-]+\//)) {
          return fse.statSync(dir).isDirectory();
        }
      });
    });
  }
}
