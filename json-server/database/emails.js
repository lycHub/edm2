// 邮箱
const Mock = require('../mock/mock');

module.exports = Mock.mock({
  'list|50': [
    {
      'id|+1': 1,
      email: '@email'
    }
  ]
}).list;
