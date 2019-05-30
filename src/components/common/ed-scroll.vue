<template>
  <div ref="wrapper" class="wrap" :style="{ 'max-height': maxHeight + 'px' }">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: 'EdScroll',
    props: {
      maxHeight: {
        type: Number,
        default: 300
      },
      data: {
        type: Array,
        require: true
      },
      click: {
        type: Boolean,
        default: true
      },
      mouseWheel: {
        type: Boolean,
        default: true
      },
      refreshDelay: {
        type: Number,
        default: 200
      },
      pullUpLoad: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      enabled() {
        return this.scroll && this.scroll.enabled;
      }
    },
    mounted() {
     this.$nextTick(() => {
       this._initScroll();
     });
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          click: this.click,
          mouseWheel: this.mouseWheel,
          pullUpLoad: this.pullUpLoad
        });

        if (this.pullUpLoad) {
          this.scroll.on('pullingUp', () => {
            this.$emit('on-pull-up');
          });
        }
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp();
      },
      openPullUp() {
        this.scroll && this.scroll.openPullUp();
      },
      closePullUp() {
        this.scroll && this.scroll.closePullUp();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      forceUpdate() {
        this.$nextTick(() => {
          if (this.pullUpLoad) {
            this.scroll && this.scroll.finishPullUp();
          }
          this.refresh();
        });
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.forceUpdate();
        }, this.refreshDelay);
      }
    }
  }
</script>
<style scoped lang="less">
  .wrap{
    overflow: hidden;

  .loader{
      img{
        display: block;
        width: 20px;
        height: 20px;
      }
    }
  }
</style>
