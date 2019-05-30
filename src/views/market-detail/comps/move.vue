<template>
  <Modal
    title="Move to folder"
    :width="600"
    v-model="show"
    @on-visible-change="$emit('on-visible-change', $event)"
    @on-ok="onOk"
    class="move">
    <span class="tip">Tip: Please select which folder you want to categorize this markeing.</span>
    <div class="folders">
      <b>List folder</b>
      <EdSelect
        ref="categorySelect"
        :count="categoryCount"
        :showSpin="showFilterSpin"
        :showLoadMoreSpin="showLoadMoreSpin"
        :visible="visible"
        :creatable="false"
        :panelWidth="538"
        @on-visible-change="visible = $event"
        @on-search="onSearch">

        <i-Input icon="ios-arrow-down" slot="handle" :value="selectedCategory.name" readonly />

        <EdScroll :data="categories" ref="categoryScroll" @on-pull-up="onPullUp">
          <div>
            <EdSelectItem
              v-for="item in categories"
              :key="item.id"
              :editable="false"
              :deletable="false"
              :id="item.id"
              :label="item.name"
              :activedId="selectedCategory.id">
              <span v-highlight @click="onSelect(item)">{{item.name}}({{item.count}})</span>
            </EdSelectItem>
          </div>
        </EdScroll>
      </EdSelect>
    </div>
  </Modal>
</template>

<script>
  import MarketCategoryServe from '../../../service/marketing/market-category.service';
  export default {
    name: 'Move',
    props: {
      showModal: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        show: this.showModal,
        visible: false,
        categoryParams: {
          pageNum: 1,
          pageSize: 8,
          name: ''
        },
        categoryCount: 0,
        categoryTotalPage: 0,
        showLoadMoreSpin: false,
        showFilterSpin: false,
        categories: [],
        selectedCategory: {}
      }
    },
    watch: {
      showModal(newVal) {
        this.show = newVal;
      },
      'categoryParams.name'() {
        this.showFilterSpin = true;
        this._getCategories();
      },
      'categoryParams.pageNum'(newVal) {
        // console.log('categoryParams._page', newVal);
        if (newVal > 1) {
          this.showLoadMoreSpin = true;
          this._getCategories(true);
        }else {
          this.$refs['categoryScroll'] && this.$refs['categoryScroll'].scrollTo(0, 0);
        }
      }
    },
    methods: {
      onSearch(keyword) {
        this.categoryParams.pageNum = 1;
        this.categoryParams.name = keyword;
      },

      onSelect(item) {
        this.selectedCategory = item;
        this.visible = false;
      },

      onPullUp() {
        this.categoryParams.pageNum = Math.min(this.categoryTotalPage, ++this.categoryParams.pageNum);
      },
      onOk() {
        console.log('ok', this.selectedCategory);
        if (this.selectedCategory.id) {
          this.$emit('on-copy-move', this.selectedCategory.id);
        }
      },
      _getCategories(isPull = false) {
        MarketCategoryServe.getMarketCategories(this.categoryParams).then(res => {
          this.categoryCount = res.total;
          this.categoryTotalPage = res.pages;

          if (isPull) {
            this.categories = this.categories.concat(res.list);
            this.showLoadMoreSpin = false;
          }else {
            this.categories = res.list;
          }
          this.showFilterSpin = false;
        });
      }
    },
    created() {
      this._getCategories();
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/styles/variable";
  .move {
    .tip{
      font-size: @font-size-normal;
    }
    .folders{
      padding: 15px;
      b{
        display: block;
        font-size: @font-size-mid;
        margin-bottom: 10px;
      }
    }
  }
</style>
