module.exports = {
  options: {
    dir: '',
    extension: '',
    importModuleOnly: false,
  },
  getModuleOptions(){
    return this.options;
  },
  setModuleOptions(rootName){
    this.options = rootName;
  },
  getRelativeDir(dir){
    if(typeof this.getModuleOptions !== 'function'){
      debugger
    }
    const { root } = this.getModuleOptions();
    return dir.replace(root, '');
  }
};
