// 可视区高度
export function viewHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

// 滚动高度
export function scrolledHeight() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
}

// 文档真实高度
export function trueHeight() {
  return document.documentElement.scrollHeight || document.body.scrollHeight;
}


// 获取元素尺寸信息
export function getRect(el) {
  const dom = typeof el === 'string' ? document.querySelector(el) : el;
  if (dom instanceof HTMLElement) {
    return dom.getBoundingClientRect();
  }else {
    return {};
  }
}
