const fse = require('fs-extra');
const {getModuleOptions} = require("./moduleOptions");
const { error } = require("./log");

const cache = new Map();

function getRelativeDir(dir){
  const { root } = getModuleOptions();
  return dir.replace(root, '');
}

module.exports = {
  getFile(file, noCache) {
    const content = noCache ? false : cache.get(file);
    if (content) {
      return Promise.resolve(content);
    } else {
      return fse.readFile(file, 'utf8').then((content) => {
        cache.set(file, content);
        return content;
      }).catch((e) => {
        console.log(e)
        error(`[读取文件失败]不存在该文件: ${getRelativeDir(file)}`)
      });
    }
  },
  writeFile(file, content) {
    return fse.writeFile(file, content).then((content) => {
      cache.set(file, content);
      return content;
    }).catch((e) => {
      console.log(e)
      error(`[写入文件失败] ${getRelativeDir(file)} ${e.message}`)
    })
  },
};
