const Color_Enmu = {
  prev: '#b7babb',
  green: '#28bebd'
};


export default function (el, binding) {
  el.style.cssText = `;width:10px;height:10px;display: inline-block;border-radius: 2px;margin-right:3px;`;
  const type = binding.value || 'prev';
  el.style.backgroundColor = Color_Enmu[type];
}
