import {COMPLETESTATUTS, OPERATES as operates} from '../configs/enums'

// 重置state
export const resetStore = function ({ commit }) {
  return new Promise(resolve => {
    _commit(commit, {
      'SET_OPERATE': operates.FREE,
      'SET_MARKET': {},
      'SET_STEP_INDEX': 0,
      'SET_COMPLETED_STEP': COMPLETESTATUTS.EMPTY
    });
    resolve();
  });
};


// 保存并下一步
export const saveToNext = function ({ commit }, { market, stepIndex }) {
  _commit(commit, {
    'SET_MARKET': market,
    'SET_STEP_INDEX': stepIndex
  });
};

function _commit(commit, obj) {
  for (const act in obj) {
    commit(act, obj[act]);
  }
}
