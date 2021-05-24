var diff = require('fast-diff');

const one = `
  export default {
  'page.common.access_exception': '访问异常1',
  'page.common.clear_all': '清空',
  'page.common.car_no': '车架号',
  'page.common.search': '查询',
  'page.common.button_next': '下一条',
  'page.common.button_save': '保存',
  'page.common.select_yes': '是',
};
`;
const other = `
  export default {
  'page.common.access_exception2': '访问异常2',
  'page.common.clear_all': '清空',
  'page.common.car_no': '车架号',
  'page.common.search': '查询',
  'page.common.button_next': '下一条',
  'page.common.button_save': '保存',
  'page.common.select_yes': '是',
};
`;

console.log(diff(one, other, 1))
