function success(message){
  console.log('\x1B[32m%s\x1B[0m', message);
}
function error(message){
  debugger
  console.log('\x1B[31m%s\x1B[0m', message);
}

Object.assign(module.exports, {
  success,
  error
});
