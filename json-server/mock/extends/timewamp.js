// 时间戳
const Mock = require('../mock');
Mock.Random.extend({
  timestamp() {
    const data = Mock.mock('@datetime("yyyy-MM-dd HH:mm")');
    return +new Date(data);
  }
});