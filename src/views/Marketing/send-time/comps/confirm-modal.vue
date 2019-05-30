<template>
  <Modal v-model="show" :mask-closable="false" width="600" @on-visible-change="onVisibleChange" :closable="false" class="modal">
    <div class="wrap">
      <div class="pic">
        <img :src="imgTxt.pic" />
      </div>
      <b v-show="imgTxt.title">{{imgTxt.title}}</b>
      <span v-show="imgTxt.desc">{{imgTxt.desc}}</span>
    </div>
    <div class="footer" slot="footer" v-if="!completed">
      <Button class="btn" v-btn-style @click="onVisibleChange(false)">Not now</Button>
      <Button class="btn" v-btn-style="'blue'" @click="$emit('on-action', 'continue')">{{isSendNow ? 'Send' : 'Continue'}}</Button>
    </div>
    <div class="footer" slot="footer" v-else>
      <Button class="btn" v-btn-style @click="$emit('on-action', 'detail')">View details</Button>
      <Button class="btn" v-btn-style="'blue'">Turn to chart</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'ConfirmModal',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      imgTxt: {
        type: Object,
        required: true
      },
      // 是否立即发送
      isSendNow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show: this.value,
        completed: false
      }
    },
    watch: {
      value(newVal) {
        this.show = newVal;
      },
      /*imgTxt(newVal) {
        console.log('imgTxt :', newVal);
      },*/
      strategy(newVal) {
        console.log('strategy in', newVal);
      }
    },
    methods: {
      onVisibleChange(visib) {
        this.$emit('input', visib);
      },
    }
  }
</script>

<style lang="less" scoped>
 @import "~assets/styles/variable";
  .modal{
    .wrap{
      text-align: center;
      font-size: @font-size-normal;
      padding: 50px 0;
      b{
        display: block;
        margin: 15px 0;
        font-size: @font-size-mid;
      }
    }
  }
</style>
