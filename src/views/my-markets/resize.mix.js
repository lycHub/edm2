import { on, off } from 'iview/src/utils/dom';
import { getRect, viewHeight } from "../../utils/dom";

export default {
  data() {
    return {
      maxHeight: 0
    }
  },
  methods: {
    _onResize() {
      this._getMaxHeight();
    },
    _getMaxHeight() {
      this.maxHeight = viewHeight() - getRect(this.$refs["listWrap"]).top - 42;
    }
  },
  mounted() {
    this._getMaxHeight();
    on(window, "resize", this._onResize);
  },
  destory() {
    off(window, "resize", this._onResize);
  }
}