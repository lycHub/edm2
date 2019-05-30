import Vue from 'vue';
import btnStyle from './btn-style.directive';
import Dot from './dot.directive';
import HighLight from './highlight.directive';

const directives = new Map([['btn-style', btnStyle], ['dot', Dot], ['highlight', HighLight]]);

for (const [key, value] of directives) {
  Vue.directive(key, value);
}