/**
 * 测试开始
 */
const path = require('path');
const objectFileSync = require('../src/index')

objectFileSync({
  dir: path.join(process.cwd(), 'test/locales'),
  extension: '.js',
});
