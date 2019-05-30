<template>
  <Spin :size="spinSize" :fix="fix">
    <Icon type="ios-loading" :size=iconSize class="spin-icon-load"></Icon>
    <div>{{label}}</div>
  </Spin>
</template>
<script>
  export default {
    name: 'EdSpin',
    props: {
      fix: {
        type: Boolean,
        default: true
      },
      spinSize: {
        type: String,
        default: 'large'
      },
      iconSize: {
        type: Number,
        default: 18
      },
      label: {
        type: String,
        default: 'Loading'
      }
    }
  }
</script>
<style lang="less" scoped>
  .spin-icon-load{
    animation: ani-spin 1s linear infinite;
  }
  @keyframes ani-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
</style>
