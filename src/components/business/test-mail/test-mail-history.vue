<template>
  <Drawer title="Test emails' records" v-model="showHistory" width="800" class="history detail" @on-close="$emit('input', false)">
    <span class="txt">Test emails have been sent to</span>
    <div class="items">
      <div v-for="item in list" :key="item" class="item">
        <Icon type="ios-mail-open-outline" size="20" />
        <span>{{item}}</span>
      </div>
    </div>
  </Drawer>
</template>

<script>
  export default {
    name: 'TestMailHistory',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      list: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        showHistory: this.value
      }
    },
    watch: {
      value(newVal) {
        this.showHistory = newVal;
      }
    }
  }
</script>

<style lang="less">
  @import "../../../assets/styles/variable";
  .history{
    &.detail .ivu-drawer-wrap{
      z-index: 1001;
    }
    .txt{
      display: block;
      font-size: @font-size-normal;
      margin-bottom: 15px;
    }
    .items{
      max-height: 800px;
      overflow: auto;
      .item{
        padding: 10px 0;
        color: @color-black;
        font-size: @font-size-normal;
        span{
          font-size: @font-size-normal;
          vertical-align: sub;
          margin-left: 5px;
        }
      }

    }
  }
</style>
