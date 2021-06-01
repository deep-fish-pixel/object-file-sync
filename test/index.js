/**
 * 测试开始
 */
const path = require('path');
const objectFileSync = require('../src/index')

setTimeout(() =>{
  objectFileSync({
    root: path.join(process.cwd(), 'test/src/locales'),
    // dirs: ['zh-CN', 'en-US'],
    // defaultIndexExtension: '.js',
    replaceDir: path.join(process.cwd(), 'test/src'),
    replaceTargetRegExp: /(\{\{\s*|="\s*)(\$t\(\s*['"])([\w-.]+)>([\w-.]+)('\s*\)\s*"|"\s*\)\s*}})/g,
    replacePropagationRegExpStr: '([\'"])${$3}([\'"])',
    replaceTargetHandle: (all, $1, $2, $3, $4, $5) => {
      return `${$1}${$2}${$4}${$5}`;
    },
    replacePropagationHandle: (all, $1, $2, replaceTargetMatches) => {
      return `${$1}${replaceTargetMatches.$4}${$2}`;
    }
  });
}, 3000);

