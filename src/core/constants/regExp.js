// 按行进行键值获取
const KeyMapSingleExpReg = /^\s*['"]?([\w\-.]+)['"]?\s*:\s*['"]([\s\S]*)['"]([,]\s*|\s*$)/;
const KeyMapSingleNumBooleanExpReg = /^\s*['"]?([\w\-.]+)['"]?\s*:\s*([\s\S]*)([,]\s*|\s*$)/;
// 对json按行分割
const LineSeparateExpReg = /\n/;
module.exports = {
  KeyMapSingleExpReg,
  KeyMapSingleNumBooleanExpReg,
  KeyMapRegExp: new RegExp(KeyMapSingleExpReg, 'g'),
  KeyMapNumBooleanRegExp: new RegExp(KeyMapSingleNumBooleanExpReg, 'g'),
  LineSeparateExpReg,
};
