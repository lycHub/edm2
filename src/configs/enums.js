// 操作枚举
export const OPERATES = {
  LAST: Symbol(),
  NEXT: Symbol(),
  SAVETOLIST: Symbol(),
  SAVETODETAIL: Symbol(),
  CANCEL: Symbol(),
  FREE: Symbol()
}

// 当前营销已完成的进度
export const COMPLETESTATUTS = {
  EMPTY: -1,
  BASE: 0,
  CONTENTS: 1,
  RECIPIENTS: 2
}


// 0-草稿，1-已安排，2-已暂停，3-发送中，4-已发送，5-已删除。默认为0
export const STATUS = ['draft', 'arranged', 'paused', 'sending', 'sent', 'deleted'];


// 0-Send at now
// 1-Fixed time and timezone
// 2-Recipients' time zone
// 3-Best opening time for recipients
// 4-Send in batches
// 5-Arrange marketing
export const STRAREGY = [
  'Send at now',
  'Fixed time and timezone',
  "Recipients' time zone",      // 无时区
  'Best opening time for recipients',
  'Send in batches',
  'Arrange marketing'
];
