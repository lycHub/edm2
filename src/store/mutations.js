import { isEmptyObj } from "../utils/tool";

const mutations = {
  SET_OPERATE(state, operate) {
    state.operate =operate;
  },
  SET_MARKET(state, market) {
    state.market = isEmptyObj(market) ? {} : Object.assign({}, state.market, market);
  },
  /* SET_MODE(state, mode) {
    state.mode = mode;
  }, */
  SET_STEP_INDEX(state, index) {
    state.stepIndex = index;
  },
  SET_COMPLETED_STEP(state, index) {
    state.completedStep = index;
  },
  SET_TEST_PREVIEW(state, testPreview) {
    state.testPreview = testPreview;
  },
  SET_USER_INFO(state, info) {
    state.userInfo = info;
  }
}

export default mutations;
