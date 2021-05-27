
function getKeyValueByRepalceLine(value, callback) {
  let hasReplaced = false;
  const first = value.replace(/^(\s*['"]?)([\w\-]+)(['"]?\s*:\s*['"])([\s\S]*)(['"])([^\n]*$)/g, wrap);
  if (hasReplaced) {
    return first;
  } else {
    return value.replace(/^(\s*['"]?)([\w\-]+)(['"]?\s*:\s*)(\w*)([^\n]*)($)/g, wrap);
  }

  function wrap() {
    hasReplaced = true;
    return callback.call(null, ...arguments);
  }
}

module.exports = getKeyValueByRepalceLine;
