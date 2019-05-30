// 营销列表
const Mock = require('../mock/mock');
require('../mock/extends/timewamp');

module.exports = Mock.mock({
  'list|300': [
    {
      'id|+1': 1,
      name: '@name(50, 100)',
      subject: '@title',
      marketCategoryId: '@integer(0, 50)',
      status: '@integer(0, 5)',
      coverImg: "https://campaigns.zoho.com/campaigns/ThumbnailDisplayAction.do?campaignId=424587000000603061&blockId=NN18:-3364788460310764004&time=1",
      time: '@timestamp',
      createTime: '@timestamp',
      abstracts: '@string(5, 100)',
      senderInfoId: '@id',
      senderEmail: '@email',
      senderName: '@cname',
      replyInfoId: '@id',
      replyEmail: '@email',
      type: 0,
      contents: '@string(0, 3000)'
    }
  ]
}).list;
