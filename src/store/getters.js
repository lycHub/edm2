export const operate = state => state.operate;

// 预览模式
// export const mode = state => state.mode;

export const stepIndex = state => state.stepIndex;
export const completedStep = state => state.completedStep;
export const testPreview = state => state.testPreview;

export const market = state => {
  return { ...state.market };
};

export const userInfo = state => state.userInfo;

// 已完成的步骤0123
/* export const completedStep = ({ market }) => {
  if (isEmptyObj(market)) {
    return false;
  }
  return (market.receiverList && market.receiverList.length) ? 2 : market.contents ? 1 : 0;
}; */
