export default function (el, binding) {
  el.style.color = 'color .2s';
  el.style.cursor = 'pointer';
  const color = binding.value || '#0099cc';
  el.addEventListener('mouseenter', function () {
    this.style.color = color;
  });
  el.addEventListener('mouseleave', function () {
    this.style.color = '';
  });
}
