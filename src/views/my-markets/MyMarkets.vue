<template>
    <div class="my-markets">
      <div class="header">
        <h2>My marketing</h2>
        <div class="boxes">
          <ButtonGroup class="btn-group">
            <Button class="btn list" :class="{active: viewMode === 'list'}" size="large" @click="changeViewMode('list')">
              <Icon type="ios-list" size="24" />
            </Button>
            <Button class="btn apps" :class="{active: viewMode === 'card'}" size="large" @click="changeViewMode('card')">
              <Icon type="ios-apps" size="24" />
            </Button>
          </ButtonGroup>
          <Button class="btn create" size="large" v-btn-style="'green'" @click="$router.push('/Marketing')">
            <!--<router-link tag="span" to="/Marketing">Create marketing</router-link>-->
            <span>Create marketing</span>
          </Button>
        </div>
      </div>

      <div class="main-wrap">
        <keep-alive>
          <MarketsList
            v-if="viewMode === 'list'"
            :list="list"
            @on-pull-up="onPullUp"
            @on-condition-change="onConditionChange"
            @on-delete="onDelete">
          </MarketsList>
          <MarketsCard :list="list" @on-pull-up="onPullUp" v-else @on-delete="onDelete"></MarketsCard>
        </keep-alive>
        <EdLoadingMore v-show="showLoadMore"></EdLoadingMore>
      </div>
      <Spin fix size="large" v-show="showSpin"></Spin>
    </div>
</template>
<script>
  import ScrollBottom from './comps/Scroll-bottom.vue'
  import MarketsList from './comps/Markets-list.vue'
  import MarketsCard from './comps/Markets-card/Markets-card.vue'
  import {off, on} from "iview/src/utils/dom"
  import MarketsServe from '../../service/marketing/markets.service'
  import MarketCategoryServe from '../../service/marketing/market-category.service'
  import { STATUS } from '../../configs/enums';
  import {isEmptyObj} from "../../utils/tool";
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'MyMarkets',
    components: {
      ScrollBottom,
      MarketsList,
      MarketsCard
    },
    data() {
      return {
        status: STATUS,
        showSpin: false,
        showLoadMore: false,

        params: {
          pageNum: 1,
          pageSize: 15,
          name: '',
          status: -1,
          marketCategoryId: 0,
          sortBy: 0
        },

        // 视图
        viewMode: 'list',

        // 列表
        list: [],

        counts: 0,
        totalPage: 0
      }
    },

    computed: mapGetters(['market']),

    watch: {
      'params.pageNum'(newVal) {
        console.log('pageNum', newVal);
        if (newVal > 1) {
          this.showLoadMore = true;
          this._getMarkets(true);
        }
      }
    },

    methods: {
      // 搜索条件改变
      onConditionChange(type, params) {
        console.log(type, params);
        this.params[type] = params;
        this.params.pageNum = 1;
        this.showSpin = true;
        this._getMarkets();
      },

      // 修改营销分类
      onChangeCategory(marketCategoryId, marketIds, cb) {
//        console.log(marketCategoryId, marketIds);
        this.showSpin = true;
        MarketsServe.changeMarketCategory(marketCategoryId, marketIds).then(cb).catch(error => {
          console.error(error);
          this.$Message.error(error.message || 'Update category failed');
          this.showSpin = false;
        });
      },

      // this.onConditionChange('marketCategoryId', item.id)

      changeViewMode(mode) {
        this.viewMode = mode;
      },

      onDelete(ids) {
        this.showSpin = true;
        const arr = Array.isArray(ids) ? ids : [ids];
        MarketsServe.deletMarkets(arr).then(res => {
          this.params.pageNum = 1;
          this._getMarkets();
          this.$Message.success(res.message);
        }).catch(error => {
          console.error(error);
          this.$Message.error(error.message || 'Delete market failed');
          this.showSpin = false;
        });
      },

      // 加载更多
      onPullUp() {
        this.params.pageNum = Math.min(this.totalPage, ++this.params.pageNum);
      },

      _getMarkets(isPull = false, cb) {
        MarketsServe.getMarketList(this.params).then(res => {
          this.count = res.total;
          this.totalPage = res.pages;


          if (isPull) {
            this.list = this.list.concat(res.list);
            this.showLoadMore = false;
          }else{
            this.list = res.list;
          }

          if (cb) cb();
          this.showSpin = false;
        }).catch(error => {
          console.error(error);
          this.$Message.error(error.message || 'Get market list failed');
          this.showSpin = false;
        });
      },
      ...mapActions(['resetStore'])
    },
    created() {
      this.showSpin = true;
      this._getMarkets();
    }
  }
</script>
<style lang="less" scoped>
  @import "~assets/styles/variable.less";
  .my-markets{
    position: relative;
    min-height: 650px;
    .header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      h2{
        font-size: @font-size-lg;
      }
      .boxes{
        .btn-group{
          margin-right: 15px;
          .active{
            background-color: @bg-btn-primary;
            color: @color-white;
          }
        }
      }
    }
  }
</style>
