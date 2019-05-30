<template>
  <div class="choose-methods">
    <ChooseItem v-for="item in methods" :key="item.id" :info="item" @on-select="$emit('on-select', item.id)"></ChooseItem>
  </div>
</template>

<script>
  import ChooseItem from './choose-item.vue'
  export default {
    name: 'ChooseMethods',
    components: {
      ChooseItem
    },
    props: {
      methods: {
        type: Array,
        required: true
      }
    },
    data() {
      return {

      }
    }
  }
</script>

<style lang="less" scoped>
  .choose-methods{
    display: flex;
    justify-content: space-around;
  }
</style>