const cache = new Map();

function set(key, value) {
  cache.set(key, value);
}

function get(key) {
  return cache.get(key);
}

function clear(key) {
  cache.delete(key);
}

function clearAll() {
  cache.clear();
}

function forEach(callback) {
  cache.forEach(callback);
}

module.exports = {
  clear,
  set,
  get,
  clearAll,
  forEach
};
