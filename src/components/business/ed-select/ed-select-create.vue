<template>
  <div class="create"><!--:maxlength="50"-->
    <i-Input :value="value" :maxlength="50" class="input" @on-keyup.enter="onOk" @on-change="$emit('input', $event.target.value)" />
    <i-Input v-show="showPass" v-model.trim="password" @on-keyup.enter="onOk" class="input pass" />
    <div class="operators">
      <Icon type="md-checkmark" size="25" class="ok" @click="onOk" />
      <Icon type="md-close" size="25" @click="$emit('on-close')" />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'EdSelectCreate',
    props: {
      value: String,
      showPass: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        password: ''
      }
    },
    methods: {
      onOk() {
        this.$emit('on-ok', this.password);
        this.password = '';
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../../../assets/styles/variable";
  .create{
    display: flex;
    align-items: center;
    justify-content: space-between;
    // width: 95%;
    .pass{
      // width: 200px;
      margin-left: 15px;
    }
    .operators{
      margin-left: 28px;
      min-width: 60px;
      .ok{
        margin-right: 10px;
        color: @color-primary;
      }
    }
  }
</style>
