// 营销分类
const Mock = require('../mock/mock');

const list = Mock.mock({
  'list|500': [
    {
      'id|+1': 1,
      name: '@word(1, 30)',
      emailCount: '@integer(9, 900)'
    }
  ]
}).list;

list.unshift(Mock.mock({
  id: 0,
  name: 'Uncategoried',
  emailCount: '@integer(5000, 10000)'
}));

module.exports = list;
