<template>
  <Modal v-model="show" title="Save as template" width="600" @on-visible-change="onVisibleChange">
    <div class="save-template">
      <div class="cate">
        <label>Template classification：</label>
        <EdSelect
          class="control"
          ref="selectRef"
          :count="count"
          :editable="false"
          createLabel="New folder"
          :visible="selectVisible"
          :showLoadMoreSpin="showLoadMoreSpin"
          :showSpin="showFilterSpin"
          @on-search="onSearch"
          @on-add="onAdd"
          @on-visible-change="selectVisible = $event">
          <i-Input
            icon="ios-arrow-down"
            slot="handle"
            placeholder="Add to template classification"
            :value="selectedCat.name"
            readonly />
          <EdScroll :data="categories" ref="edScroll" :maxHeight="190" @on-pull-up="onPullUp">
            <div>
              <EdSelectItem
                v-for="item in categories"
                :key="item.id"
                :id="item.id"
                :editable="false"
                :deletable="false">
                <div class="drop-down-item">
                  <span class="item-name" v-highlight @click="onSelect(item)">{{item.name}}</span>
                </div>
                <!--<span v-highlight @click="onSelect(item)">{{item.name}}</span>-->
              </EdSelectItem>
            </div>
          </EdScroll>
        </EdSelect>
      </div>
      <div class="name">
        <label>Name：</label>
        <i-Input :maxlength="50" class="control" v-model.trim="newName" />
      </div>
    </div>
    <div class="footer" slot="footer">
      <Button class="btn" v-btn-style @click="onVisibleChange(false)">CANCEL</Button>
      <Button class="btn" v-btn-style="'blue'" @click="onOk">OK</Button>
    </div>
  </Modal>
</template>

<script>
import TemplateServe from "../../../../service/marketing/template.service";
import { isEmptyObj } from '../../../../utils/tool';
export default {
  name: "SaveTemplate",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.value,
      selectVisible: false,
      showFilterSpin: false,
      showLoadMoreSpin: false,
      categories: [],
      count: 0,
      totalPage: 0,

      // 分类的查询参数
      categoryParams: {
        pageNum: 1,
        pageSize: 8,
        name: ''
      },

      selectedCat: {},
      newName: ""
    };
  },
  watch: {
    value(newVal) {
      this.show = newVal;
    },
    'categoryParams.pageNum'(newVal) {
      console.log('pageNum :', newVal);
      if (newVal > 1) {
        this.showLoadMoreSpin = true;
        this._getCategories(this.categoryParams, true);
      }else {
        this.$refs['edScroll'] && this.$refs['edScroll'].scrollTo(0, 0);
      }
    },
    'categoryParams.name'(newVal) {
      this.showFilterSpin = true;
      this._getCategories();
    }
  },
  methods: {
    onVisibleChange(visib) {
      this.$emit('input', visib);
    },
    onPullUp() {
      this.categoryParams.pageNum = Math.min(this.totalPage, ++this.categoryParams.pageNum);
    },
    onSearch(name) {
      this.categoryParams.pageNum = 1;
      this.categoryParams.name = name;
    },
    onSelect(cat) {
      this.selectedCat = cat;
      this.selectVisible = false;
    },
    onAdd(params) {
      if (params.newItemName.length > 50) {
        this.$Message.warning("Template's name cannot be longer than 50 characters");
      }else {
        this.showFilterSpin = true;
        TemplateServe.addTemplateCategory(params.newItemName).then(res => {
          this.$Message.success(res.message);
          this.$refs["selectRef"].creating = false;
          this.categoryParams.pageNum = 1;
          // this.categoryParams.name = '';
          this._getCategories();
        }).catch(error => {
          console.error('error', error);
          this.$Message.error(error.message);
          this.showFilterSpin = false;
        });
      }
    },
    onOk() {
      if (this.newName.length > 50) {
        this.$Message.warning("template's name cannot be longer than 50 characters");
      }else if (!this.selectedCat.id || !this.newName) {
        this.$Message.warning('Please select the category and fill in the template name');
      }else {
        this.$emit('on-ok', {
          templateCategoryId: this.selectedCat.id,
          name: this.newName
        });
      }
    },
    _getCategories(isPull = false) {
      TemplateServe.getTemplateCategories(this.categoryParams).then(res => {
        // console.log("categories", res);
        // const hasAll = this.categoryParams.pageNum ===1 && !this.categoryParams.name;
        this.count = res.total;
        this.totalPage = res.pages;
        const list = res.list.filter(item => item.id !== 1);
        if (isPull) {
          this.categories = this.categories.concat(list);
          this.showLoadMoreSpin = false;
        }else {
          // this.categories = hasAll ? res.list.filter(item => item.id !== 1) : res.list;
          this.categories = list;
        }
          // console.log("categories :", this.categories);
        this.showFilterSpin = false;
      });
    }
  },
  created() {
    this._getCategories();
  }
};
</script>

<style lang="less" scoped>
@import "~assets/styles/variable";
.save-template {
  padding: 10px 0;
  > div {
    display: flex;
    align-items: center;
    &:first-child {
      margin-bottom: 30px;
    }
    label {
      display: block;
      width: 190px;
      text-align: right;
      margin-right: 10px;
      font-size: @font-size-mid;
    }
    .control {
      width: 350px;
    }
  }
}
</style>
