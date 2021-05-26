// 按行进行键值获取
const KeyMapExpReg = /^\s*['"]?([\w\-]+)['"]?\s*:\s*['"]?([\s\S]*)['"]?([,]\s*|\s*$)/g;
// 对json按行分割
const LineSeparateExpReg = /,\s*\n\s*|\s*\n\s*$/;

module.exports = {
  KeyMapExpReg,
  LineSeparateExpReg,
};
