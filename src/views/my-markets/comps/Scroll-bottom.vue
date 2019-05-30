<template>
  <div class="scroll-bottom">
    <slot></slot>
    <EdLoadingMore v-show="showLoader"></EdLoadingMore>
  </div>
</template>

<script>
  import { viewHeight, scrolledHeight, trueHeight } from "../../../utils/dom";
  import { on, off } from 'iview/src/utils/dom';
  import throttle from 'lodash.throttle';

  export default {
    name: 'ScrollBottom',
    props: {
      showLoader: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.onScroll();
    },
    watch: {
      showLoader(newVal) {
        if (newVal) {
          this._unBindScrollEvent();
        }else {
          this.onScroll();
        }
      }
    },
    methods: {
      onScroll() {
        this.handleScroll = throttle(this._bindScrollEvent, 300, {leading: false});
        on(window, 'scroll', this.handleScroll);
      },
      _bindScrollEvent() {
        if ((viewHeight() + scrolledHeight()) >= (trueHeight() - 20)) {
          console.log('bottom');
          this.$emit('on-bottom');
        }
      },
      _unBindScrollEvent() {
        off(window, 'scroll', this.handleScroll);
        this.handleScroll = null;
      }
    },
    beforeDestroy() {
      this._unBindScrollEvent();
    }
  }
</script>
