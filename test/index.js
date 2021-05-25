/**
 * 测试开始
 */
const path = require('path');
const autoImportModule = require('../src/index')

autoImportModule({
  dir: path.join(process.cwd(), 'test/locales'),
  extension: '.js',
});
