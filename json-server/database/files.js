// 模板列表
const Mock = require('../mock/mock');
require('../mock/extends/fileType');
module.exports = Mock.mock({
  'list|307': [
    {
      'id|+1': 1,
      fileName: '@string(10, 100)',
      filePath: 'dadasdasdadasdasdas',
      type: '@fileType'
    }
  ]
}).list;
