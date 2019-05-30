<template>
  <div class="special">
      <div class="item" v-for="item in templates" :key="item.id">
        <TemplateItem ref="templateItem" :item="item" @on-editing="onEditing"></TemplateItem>
      </div>
  </div>
</template>

<script>
  import TemplateItem from './template-item.vue'
  export default {
    name: 'SpecialTemplates',
    components: {
      TemplateItem
    },
     props: {
      templates: {
        type: Array,
        default: []
      }
    },
    methods: {
      // 双击名称开始编辑
      onEditing(id) {
        this.$refs['templateItem'].map(item => item.isEditing = item.item.id === id);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../../assets/styles/variable";
  .special {
      display: flex;
      flex-wrap: wrap;
      .item{
          width: 220px;
          margin: 0 0 50px 20px;
      }
  }
</style>
