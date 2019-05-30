<template>
  <div class="all">
    <div class="classify-item" v-for="(cat, index) in templates" :key="cat.id">
      <div class="title" v-show="cat.children.length">
        {{cat.category}} <span @click="showMore(index)">（Show more）</span>
      </div>
      <div class="list-wrap" ref="listWrap">
        <div class="item" v-for="item in cat.children" :key="item.id">
          <TemplateItem ref="templateItem" :item="item" @on-editing="onEditing"></TemplateItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TemplateItem from './template-item.vue'
  export default {
    name: 'AllTemplates',
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
      showMore(index) {
        this.$refs['listWrap'][index].style.maxHeight = 'none';
      },
      // 双击名称开始编辑
      onEditing(id) {
        // console.log('items :', this.$refs['templateItem']);
        this.$refs['templateItem'].map(item => item.isEditing = item.item.id === id);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../../assets/styles/variable";
  .all {
    .classify-item{
      .title{
        font-size: @font-size-mid;
        margin-bottom: 20px;
        span{
          color: @font-color-blue;
          cursor: pointer;
        }
      }
      .list-wrap{
        display: flex;
        flex-wrap: wrap;
        max-height: 350px;
        overflow-y: hidden;
        .item{
          width: 220px;
          margin: 0 0 50px 20px;
        }
      }

      &:last-child{
        margin-bottom: 30px;
      }
    }
  }
</style>
