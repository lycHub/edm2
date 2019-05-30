import { on, off } from 'iview/src/utils/dom';
import {findComponentsDownward} from "iview/src/utils/assist";
export default {
  props: {
    placement: {
      type: String,
      default: 'bottom-end'
    },
    // 是否显示下拉
    visible: {
      type: Boolean,
      default: false
    },
    showLoadMoreSpin: {
      type: Boolean,
      default: false
    },

    // 显示加载中
    showSpin: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      searchWord: ''
    }
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        on(window, 'click', this._bindWinClick);
        document.documentElement.style.overflowY = 'hidden';
      }else {
        this._unBindWinClick();
        this.creating = false;
        // this.searchWord = '';
        document.documentElement.style.overflowY = 'scroll';
      }
      this.$emit('on-visible-change', newVal);
    }
  },

  created() {
    // 是否点击了下拉面板
    this.selfClick = false;
  },
  methods: {
    toggleMenu() {
      this.selfClick = true;
      this.$emit('on-visible-change', !this.visible);
    },
    onMenuClick() {
      this.selfClick = true;
    },
    _bindWinClick() {
      if (!this.selfClick) {
        this.$emit('on-visible-change', false);
      }
      this.selfClick = false;
    },
    _unBindWinClick() {
      off(window, 'click', this._bindWinClick);
    }
  },
  destory() {
    this._unBindWinClick();
  }
}
