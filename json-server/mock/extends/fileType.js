// 时间戳
const Mock = require('../mock');
Mock.Random.extend({
  fileType() {
    const typeArr = [
      'docx', 'xls', 'xlsx', 'pptx', 'txt', 'pdf', 'jpg', 'png', 'gif', 'jpeg', 'zip', 'rar'
    ];
    return this.pick(typeArr);
  }
});
