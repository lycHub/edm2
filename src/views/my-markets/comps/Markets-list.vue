<template>
  <div class="markets-list">
    <div class="filters">
      <div class="left">
        <Checkbox
          class="select-all"
          size="large"
          v-model="hasSelectAll"
          @on-change="onSelectAllChange">
        </Checkbox>
        <EdSelect
          ref="categorySelectRef"
          placement="bottom-start"
          :count="categoryCount"
          :showSpin="showFilterSpin"
          :showLoadMoreSpin="showLoadMoreSpin"
          :visible="visible"
          @on-visible-change="visible = $event"
          @on-search="onSearch"
          @on-add="onAdd">
          <Button slot="handle" icon="ios-folder-outline" size="large" :class="['btn-ed-select', {active: this.visible}]">
            <span class="item-name" v-if="!selectedList.length">{{selectedCategory.name}}</span>
            <span v-else>Move to folder</span>
            <!--<Icon :type="classifyIconType" size="18" />-->
            <Icon type="ios-arrow-down" size="18"/>
          </Button>
          <EdScroll :data="categories" ref="categoryScroll" @on-pull-up="onPullUp">
            <div>
              <EdSelectItem
                @on-confirm-edit="onConfirmEdit"
                @on-delete="onDeleteCategory"
                v-for="item in categories"
                :key="item.id"
                :editable="item.name !== 'Uncategoried' && item.id !== 0"
                :deletable="item.name !== 'Uncategoried' && item.id !== 0"
                :id="item.id"
                :label="item.name"
                :activedId="selectedCategory.id">
                <!--max-width: 232px;-->
                <div class="drop-down-item">
                  <span class="item-name" v-highlight @click="onSelectCategory(item)">{{item.name}}</span>
                  <span v-show="item.id">({{item.count || 0}})</span>
                </div>
              </EdSelectItem>
            </div>
          </EdScroll>
        </EdSelect>

        <EdFilter
          placement="bottom-start"
          class="filter-status"
          :visible="showConditionFilter"
          cancelText="Reset"
          @on-visible-change="showConditionFilter = $event"
          @on-cancel="resetStatus"
          @on-ok="onChangeParams('status', params['status'])">
          <Button size="large" slot="handle">Filter Condition
            <Icon type="ios-arrow-down"/>
          </Button>
          <label class="label">Marketing Status：</label>
          <Select class="select" placeholder="All Status" v-model="params.status">
            <Option v-for="item in statuList" :value="item.value" :key="item.value" class="option">{{ item.desc }}</Option>
          </Select>
        </EdFilter>
        <Button size="large" v-show="selectedList.length" @click="onDelete">
          <Icon type="md-trash" size="20" />
        </Button>
      </div>

      <div class="right">
        <Select class="select" size="large" v-model="params.sortBy">
          <Option :value="0">Recently created</Option>
          <Option :value="2">Creation date</Option>
          <Option :value="1">Last modified</Option>
        </Select>
        <EdFilter
          class="filter-status"
          :visible="showSearchFilter"
          @on-visible-change="showSearchFilter = $event"
          @on-ok="onChangeParams('name', params['name'])">
          <Button size="large" slot="handle">
            <Icon type="ios-search" size="20"/>
          </Button>
          <i-Input placeholder="Searching" v-model="params.name"/>
        </EdFilter>
      </div>
    </div>
    <div class="list-wrap" ref="listWrap">
      <b v-if="!markets.length">NO RESULT</b>
      <EdScroll v-else :data="markets" ref="marketScroll" :maxHeight="maxHeight" @on-pull-up="onPullUp('market')">
        <div>
          <div :class="['item', { checked: isChecked(item.id) }]" v-for="item in markets" :key="item.id">
            <div class="info">
              <Checkbox :class="['checkbox', {show: isChecked(item.id)}]" :value="isChecked(item.id)" size="large" @on-change="onSelect($event, item.id)"></Checkbox>
              <Icon type="md-mail" size="36" class="icon" />
              <router-link tag="div" :to="{ name: 'MarketDetail', params: { id: item.id }}" class="text">
                <span class="title">{{item.name}}</span>
                <div class="extras">
                  <div class="status">
                    <i v-dot="status[item.status] === 'sent' ? 'green' : 'prev'"></i>
                    {{status[item.status]}}
                  </div>
                  <Divider type="vertical"/>
                  <span class="time" v-if="status[item.status] === 'draft'">
                    {{item.createTime | format}} {{item.timeZone || ''}}
                  </span>
                  <span class="time" v-else>
                    {{item.time | format}} {{item.timeZone || ''}}
                  </span>
                </div>
              </router-link>
            </div>
            <div class="operators">
             <!--  <Tooltip
                content="View report"
                placement="top"
                transfer
                v-show="status[item.status] === 'sent'">
                <Icon type="md-stats" size="22" class="icon stats" />
              </Tooltip> -->
              <Tooltip content="Copy" placement="top" transfer>
                <Icon type="ios-copy" size="22" class="icon copy" @click.native="onOperate('copy', item)" />
              </Tooltip>
              <More v-show="status[item.status] !== 'deleted'">
                <Icon type="ios-more" size="22" class="icon more"/>
                <div slot="items">
                  <DropdownItem style="font-size:14px !important;" v-show="status[item.status] !== 'sent'" @click.native="onOperate('edit', item)">Edit</DropdownItem>
                  <DropdownItem style="font-size:14px !important;" @click.native="onOperate('delete', item)">Delete</DropdownItem>
                </div>
              </More>
            </div>
          </div>
        </div>
      </EdScroll>
      <!--<EdLoadingMore v-show="showLoadMore"></EdLoadingMore>-->
    </div>
    <!--<Spin fix size="large" v-show="showSpin"></Spin>-->
  </div>
</template>

<script>
  import MarketCategoryServe from "service/marketing/market-category.service";
  import CommonServe from "service/marketing/common.service";
  import {isEmptyObj, setStroge} from "../../../utils/tool";
  import Resize from '../resize.mix';
  import { STATUS } from '../../../configs/enums';
  import {findComponentUpward} from "iview/src/utils/assist";
  import {mapGetters} from 'vuex';

  export default {
    name: "MarketsList",
    mixins: [Resize],
    props: {
      list: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        statuList: [],
        status: STATUS,
        // 下拉是否显示
        visible: false,
//      showSpin: false,
        showConditionFilter: false,
        showSearchFilter: false,

        // 分类的spin
        showFilterSpin: false,
        showLoadMoreSpin: false,

        categoryParams: {
          pageNum: 1,
          pageSize: 8,
          name: ''
        },

        categories: [],
        categoryCount: 0,
        categoryTotalPage: 0,

        // 当前选中的分类
        selectedCategory: {
          id: 0,
          name: 'All',
        },

        markets: [],
        count: 0,

        // 被勾选的项
        selectedList: [],

        // 是否全选
        hasSelectAll: false,

        // 筛选条件
        params: {
          name: "",
          status: -1,
          sortBy: 0
        }
      };
    },
    computed: mapGetters(['userInfo']),
    watch: {
      list(newVal) {
        this.markets = newVal;
      },

      "params.sortBy"(newVal) {
        this.onChangeParams("sortBy", newVal);
      },

      selectedList(newVal) {
        this.hasSelectAll = newVal.length > 0 && (newVal.length === this.markets.length);
//      console.log("markets :", this.markets);
      },

      "categoryParams.name"() {
        this.showFilterSpin = true;
        this._getCategories();
      },

      "categoryParams.pageNum"(newVal) {
        if (newVal > 1) {
          this.showLoadMoreSpin = true;
          this._getCategories(true);
        } else {
          this.$refs["categoryScroll"] && this.$refs["categoryScroll"].scrollTo(0, 0);
        }
      },
      /*hasSelectAll(newVal) {
        console.log('hasSelectAll', newVal);
      }*/
    },
    methods: {
      // 是否被选中
      isChecked(id) {
        return this.selectedList.includes(id);
        // selectedList.includes(item.id)
      },

      // 重置筛选状态
      resetStatus() {
        if (this.params.status !== -1) {
          this.params.status = -1;
          this.onChangeParams('status', -1);
        }
      },

      // 改变筛选条件
      onChangeParams(key, val) {
        this.$emit("on-condition-change", key, val);
        this.visible = this.showConditionFilter = this.showSearchFilter = false;
        this.selectedList = [];
      },

      // 编辑复制或删除
      onOperate(type, item) {
        // console.log(type, id);
        switch(type) {
          case 'edit':
            setStroge([{
              key: 'marketingId',
              value: item.id
            }, {
              key: 'marketingName',
              value: item.name
            }, {
              key: 'isEdit',
              value: true
            }]);
            this.$router.push("/Marketing");
            break;
          case 'delete':
            this.$Modal.confirm({
              title: "Once this email marketing is deleted, it cannot be recovered！Do you want to continue？",
              onOk: () => {
                this.$emit('on-delete', item.id);
              }
            });
            break;
          case 'copy':
            this.$router.push('/Copy/' + item.id);
            break;
        }
      },

      // 勾选
      onSelect(evt, id) {
        if (evt) {
          this.selectedList.push(id);
        } else {
          const index = this.selectedList.findIndex(item => item === id);
          if (index !== -1) {
            this.markets.find(item => item.id === id).checked = false;
            this.selectedList.splice(index, 1);
          }
          console.log('markets', this.markets);
        }
      },

      onSelectAllChange(evt) {
        this.markets.forEach(item => (item.checked = evt));
        if (evt) {
          this.selectedList = this.markets.map(item => item.id);
        } else {
          this.selectedList = [];
        }
      },

      // 删除邮件
      onDelete() {
        if (!this.selectedList.length) return;
        console.log('selectedList', this.selectedList);
        const list = [];

        // 过滤deleted
        for (const id of this.selectedList) {
          const status = this.markets.find(item => item.id === id).status;
          if (this.status[status] !== 'deleted') {
            list.push(id);
          }
        }
//      console.log(list);

        if (list.length) {
          let hasDeleted = false;
          for (const id of list) {
            const status = this.markets.find(item => item.id === id).status;
            hasDeleted = this.status[status] === 'sending';
            if (hasDeleted) break;
          }
          if (hasDeleted) {
            this.$Message.error('Sending cannot be deleted again!');
          }else {
            this.$Modal.confirm({
              title: "Once this email marketing is deleted, it cannot be recovered！Do you want to continue？",
              onOk: () => {
                this.$emit('on-delete', list);
                this.selectedList = [];
              }
            });
          }
        }
      },

      // 搜索分类
      onSearch(keyword) {
        this.categoryParams.pageNum = 1;
        this.categoryParams.name = keyword;
      },

      // 选中分类
      onSelectCategory(item) {
        this.selectedCategory = item;
        if (this.selectedList.length) {
          if (item.id) {
            const par = findComponentUpward(this, 'MyMarkets');
            if (par) {
              par.onChangeCategory(item.id, this.selectedList, () => {
                this.categoryParams.pageNum = 1;
                this.categoryParams.name = '';
                this.selectedList = [];
                this._getCategories();
                this.onChangeParams('marketCategoryId', item.id);
              });
            }
          }
        }else {
          this.onChangeParams('marketCategoryId', item.id);
        }
        this.visible = false;
      },

      // 新增分类
      onAdd(params) {
        this._addCategory(params.newItemName);
      },

      // 分类下拉加载
      onPullUp(type) {
        if (type === 'market') {
          this.$emit('on-pull-up');
        }else {
          this.categoryParams.pageNum = Math.min(this.categoryTotalPage, ++this.categoryParams.pageNum);
        }
      },

      // 修改分类
      onConfirmEdit(params) {
        this.showFilterSpin = true;
        MarketCategoryServe.editMarketCategories(params).then(res => {
          this.$Message.success(res.message);
          this.categoryParams.pageNum = 1;
          this.categoryParams.name = "";
          this._getCategories();
          this.$refs['categorySelectRef'].onClose(params.id);
        }).catch(err => {
          console.error('err add:', err);
          this.$Message.error(err.message);
          this.showFilterSpin = false;
        });
      },

      // 删除分类
      onDeleteCategory(id) {
        this.$Modal.confirm({
          title: 'Confirm deletion？',
          okText: 'OK',
          cancelText: 'Cancel',
          onOk: () => {
            if (this.userInfo.id) {
              this.showFilterSpin = true;
              MarketCategoryServe.deleteMarketCategories(id, this.userInfo.id).then(res => {
                this.$Message.success(res.message);
                this.categoryParams.pageNum = 1;
                this.categoryParams.name = "";
                this._getCategories();
              });
            }else {
              this.$Message.error('No user info');
            }
          }
        });
      },

      // 分类列表
      _getCategories(isPull = false) {
        MarketCategoryServe.getMarketCategories(this.categoryParams).then(res => {
//      console.log('dasdfefew', res);
          this.categoryCount = res.total;
          this.categoryTotalPage = res.pages;

          if (isPull) {
            this.categories = this.categories.concat(res.list);
          } else {
            this.categories = this.categoryParams.name ? res.list : [{
              "id": 0,
              "name": "All",
            }, ...res.list];
//          console.log('categories', this.categories);
          }
          this.showLoadMoreSpin = false;
          this.showFilterSpin = false;
          // this.showSpin = false;
        });
      },

      // 新增分类
      _addCategory(label) {
        this.showFilterSpin = true;
        MarketCategoryServe.addMarketCategories(label).then(res => {
          this.$Message.success(res.message);
          this.categoryParams.pageNum = 1;
          this.categoryParams.name = "";
          this._getCategories();
          this.$refs['categorySelectRef'].creating = false;
        }).catch(err => {
          console.log('err add:', err);
          this.$Message.error(err.message);
          this.showFilterSpin = false;
        });
      },
      _getMarketStatus() {
        CommonServe.getMarketStatus().then(res => this.statuList = res);
      }
    },
    created() {
      this._getCategories();
      this._getMarketStatus();
    }
  };
</script>

<style lang="less" scoped>
  @import "~assets/styles/variable.less";
  .markets-list {
    position: relative;
    .filters {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      .left {
        display: flex;
        align-items: center;
        /* .ed-select {
          width: 200px;
        } */
        .filter-status {
          margin: 0 10px;
          .label {
            margin-right: 10px;
            font-size: @font-size-normal;
          }
          .select {
            width: 150px;
            .option{
              font-size: @font-size-normal !important;
            }
          }
        }
      }
      .right {
        width: 260px;
        display: flex;
        justify-content: space-between;
        .select {
          width: 200px;
        }
      }
    }

    .list-wrap {
      b{
        display: block;
        text-align: center;
        margin-top: 50px;
        font-size: @font-size-lgx;
      }
      .item {
        padding: 20px 40px 20px 20px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        &:hover {
          background-color: @bg-shallow-prev;
          .info{
            .checkbox{
              visibility: visible;
            }
          }
        }
        &.checked {
          background-color: @bg-shallow-prev;
        }

        .info {
          display: flex;
          align-items: center;
          .checkbox{
            visibility: hidden;
            &.show{
              visibility: visible;
            }
          }
          .icon {
            color: @color-green;
          }
          .text {
            margin-left: 8px;
            .title {
              font-size: @font-size-mid;
            }
            .extras {
              display: flex;
              font-size: @font-size-normal;
              margin-top: 8px;
            }
          }
        }
        .operators {
          min-width: 100px;
          .icon {
            margin-left: 10px;
          }
        }
      }
    }
  }
</style>
