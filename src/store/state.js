import {COMPLETESTATUTS, OPERATES as operates} from '../configs/enums'
const state = {
  operate: operates.FREE,
  market: {},

  // 测试预览用到的contents和contentFiles
  testPreview: {},

  // 预览模式
  // mode: 'pc',

  // 当前步骤的索引
  stepIndex: 0,

  // 当前营销已完成的步骤
  completedStep: COMPLETESTATUTS.EMPTY,

  // 用户信息
  userInfo: {}
}

export default state;
