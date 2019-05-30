
const bgColorEnum = {
  prev: '#667b99',
  green: '#28bebd',
  blue: '#0099cc',
  white: '#fff',
  red: '#ed4014'
};

export default function (el, binding) {
  const type = binding.value || 'prev';
  el.style.color = type === 'white' ? '#000' : '#fff';
  el.style.backgroundColor = bgColorEnum[type];
  if (type !== 'white') {
    el.style.borderColor = bgColorEnum[type];
  }
}
