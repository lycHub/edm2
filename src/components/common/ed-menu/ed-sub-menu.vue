<template>
  <li :class="classes" @click="handleClick" @mouseleave="handleMouseLeave">
    <slot name="title"></slot>

    <transition name="menu-ani">
      <ul class="ed-sub-menu-content" v-show="opened">
        <slot></slot>
      </ul>
    </transition>
  </li>
</template>
<script>
  import {findComponentsDownward, findComponentUpward} from "iview/src/utils/assist";
  import Emitter from 'iview/src/mixins/emitter';
  const prefixCls = 'ed-sub-menu';
  export default {
    name: 'EdSubMenu',
    mixins: [ Emitter ],
    props: {
      name: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        opened: false,
        active: false,
        isReadyClick: true
      }
    },
    computed: {
      classes() {
        return this.active ? prefixCls + ' opened' : prefixCls
      }
    },
    methods: {
      handleClick() {
//        const opened = this.opened;
//        this.opened = !opened;
        this.parent.updateOpenKeys(this.name);
      },
      handleMouseLeave() {
//        console.log('leave'); // ????????
        this.parent.updateOpenKeys('', 'mouseleave');
      }
    },
    mounted() {
      this.parent  = findComponentUpward(this, 'EdMenu');
      this.$on('on-menu-item-select', name => {
        this.dispatch('EdMenu', 'on-menu-item-select', name);
        return true;
      });

      this.$on('on-update-active-name', status => this.active = status);
    }
  }
</script>
<style scoped lang="less">
  @import "../../../assets/styles/variable";
  .ed-sub-menu{
    position: relative;
    cursor: pointer;
    color: @color-white;
    &.opened{
      background-color: @color-black;
    }

    &:hover{
      background-color: @color-black;
    }

    .ed-sub-menu-content{
      position: absolute;
      background-color: @color-black;
      width: 200px;
      top:0;
      left: 90px;
      transition: all .3s;
      /*transform-origin: left top;*/
    }
  }


  .menu-ani-enter-active, .menu-ani-leave-active {
    opacity: 1;
    transform: translateX(0);
  }
  .menu-ani-enter, .menu-ani-leave-to {
    opacity: 0;
    transform: translateX(15px);
  }
</style>
