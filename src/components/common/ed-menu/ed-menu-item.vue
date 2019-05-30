<template>
  <li :class="classes" @click="handleClickItem"><slot></slot></li>
</template>
<script>
  import {findComponentUpward} from "iview/src/utils/assist";
  import Emitter from 'iview/src/mixins/emitter';
  import {mapActions} from 'vuex';
  import {removeStroge} from "../../../utils/tool";
  export default {
    name: 'EdMenuItem',
    mixins: [ Emitter ],
    props: {
      to: {
        type: [Object, String],
        default: ''
      },
      name: {
        type: [String, Number]
      }
    },
//    inject: ['activeName'],
    data () {
      return {
        active: false
      };
    },
    computed: {
      classes() {
        return this.active ? 'ed-menu-item active' : 'ed-menu-item'
      }
    },
    methods: {
      handleClickItem() {
        const compName = findComponentUpward(this, 'EdSubMenu') ? 'EdSubMenu' : 'EdMenu';
        this.dispatch(compName, 'on-menu-item-select', this.name);
        if (this.name === 'CreateMarketing') {
          removeStroge(['marketingId', 'marketingName', 'isEdit']);
          this.resetStore().then(_ => this.$router.push(this.to));
        }else {
          this.$router.push(this.to);
        }
      },
      ...mapActions(['resetStore']),
    },
    mounted() {
      this.$on('on-update-active-name', name => {
//        console.log('item', name);
        if (this.name === name) {
          this.active = true;
          this.dispatch('EdSubMenu', 'on-update-active-name', true);
        } else {
          this.active = false;
        }
      });
    }
  }
</script>
<style scoped lang="less">
  @import "../../../assets/styles/variable";
  .ed-menu-item{
    display: block;
    text-align: center;
    padding: 15px;
    font-size: @font-size-normal;
    transition: all .3s;
    &:hover{
      color:@color-white;
      background-color: @bg-btn-blue;
    }
    &.active{
      color:@color-white;
      background-color: @bg-btn-blue;
    }
  }
</style>
