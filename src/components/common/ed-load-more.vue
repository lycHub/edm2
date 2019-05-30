<template>
  <div class="loader">
    <div class="dot" v-for="n in 5"></div>
  </div>
</template>
<script>
  export default {
    name: 'EdLoadingMore'
  }
</script>
<style lang="less" scoped>
  @import "../../assets/styles/variable";
  @import "../../assets/styles/mixin";

  .loader{
    text-align: center;
    margin-left: 50%;
    transform: translate3d(-50%,-50%,0);
    margin-top: 15px;
    .dot{
      width: 10px;
      height: 10px;
      background-color: @color-green;
      border-radius: 100%;
      display: inline-block;
      animation: slide 1s infinite;
      .loop(5);
    }
  }


  @keyframes slide{
    0%{
      transform: scale(1);
    }
    50%{
      opacity: .3;
      transform: scale(2);
    }
    100%{
      transform: scale(1);
    }
  }
</style>
