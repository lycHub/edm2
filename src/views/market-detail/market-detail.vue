<template>
  <div class="market-detail">
    <div class="header">
      <div class="left">
        <router-link to="/MyMarkets" tag="span">
          <Icon type="md-arrow-back" size="26" class="icon" />
        </router-link>
        <div class="txt">
        <EdSelect
          placement="bottom-start"
          :count="count"
          :showSpin="showFilterSpin"
          :showLoadMoreSpin="showLoadMoreSpin"
          :visible="visible"
          :creatable="false"
          @on-visible-change="visible = $event"
          @on-search="onSearch">
          <div slot="handle" class="title">
            <span :class="['btn-ed-select', {active: this.visible}]" v-highlight>
              {{selectedMarket.name}}
            </span>
            <Icon type="ios-arrow-down" size="18" />
          </div>


          <EdScroll :data="list" ref="edScroll" @on-pull-up="onPullUp">
            <div>
              <EdSelectItem
                v-for="item in list"
                :key="item.id"
                :id="item.id"
                :activedId="selectedMarket.id"
                :editable="false"
                :deletable="false">
                <div class="drop-down-item">
                  <span class="item-name" v-highlight @click="onSelect(item)">{{item.name}}</span>
                </div>
              </EdSelectItem>
            </div>
          </EdScroll>
        </EdSelect>

          <div class="extras">
            <div class="status">
              <i v-dot="status[market.status] === 'sent' ? 'green' : 'prev'"></i>
              {{status[market.status]}}
            </div>
            <Divider type="vertical" />
            <span class="time">{{market.createTime | format}}</span>
          </div>
        </div>
      </div>
      <div class="deleted" v-show="status[market.status] === 'deleted'">
        <img src="../../assets/images/deleted.png" />
      </div>

      <MarketBtns :hasRc="hasRc" :currentStatus="status[market.status]" :strategy="strategy" @on-edit="onEdit" @on-operate="onOperate"></MarketBtns>
    </div>

    <div class="contents-wrap">
      <div class="left">
        <MarketContent :market="market" @on-change-abstracts="onChangeAbstracts"></MarketContent>
      </div>
      <div class="right">
        <MarketInfo :market="market" :strategy="strategy" @count-receiver="countReceiver = $event" @on-actArrange="onActArrange"></MarketInfo>
      </div>
    </div>

    <!-- move to folder -->
    <Move :showModal="showMoveModal" @on-visible-change="showMoveModal = $event" @on-copy-move="onCopyMove"></Move>


    <!--发送测试邮件-->
     <Drawer v-if="hasRc" title="Test email" v-model="showSend" width="800" class="drawer">
      <TestMailSend ref="testMailSend" @on-show-history="openHistory" @on-send="onSend"></TestMailSend>
    </Drawer>
    <TestMailHistory v-model="showHistory" :list="histories"></TestMailHistory>


    <Spin fix size="large" v-show="showSpin" style="z-index: 1002;"></Spin>
  </div>
</template>
<script>
  import MarketsServe from '../../service/marketing/markets.service'
  import SendServe from '../../service/marketing/send.service'
  import MarketContent from './comps/market-content'
  import MarketInfo from './comps/market-info'
  import MarketBtns from './comps/market-btns'
  import Move from './comps/move'
  import {isEmptyObj, setStroge} from '../../utils/tool'
  import {STATUS} from "../../configs/enums";

export default {
  name: 'MarketDetail',
  components: {
    MarketContent,
    MarketInfo,
    MarketBtns,
    Move
  },
  props: ['id'],
  data() {
    return {
      showSpin: false,
      showFilterSpin: false,
      showLoadMoreSpin: false,
      market: {},
      strategy: {}, // 发送时间
      params: {
        pageNum: 1,
        pageSize: 10,
        name: ''
      },

      // 营销列表
      list: [],
      count: 0,
      totalPage: 0,
      visible: false,

      // 历史列表
      histories: [],

      // 选中的market
      selectedMarket: {},


      showSend: false,
      showHistory: false,
      status: STATUS,

      showMoveModal: false,
      showCopyModal: false,

      // 收件人数量
      countReceiver: 0
    }
  },
  computed: {
    classifyIconType() {
      return this.visible ? 'ios-arrow-up' : 'ios-arrow-down';
    },

    // 是否有内容和收件人
    hasRc() {
//      console.log('countReceiver', this.countReceiver);
      return this.countReceiver > 0 && (this.market.contents && this.market.contents.length > 0);
    }
  },
  watch: {
    strategy(newVal) {
      console.log('watch strategy', newVal);
    },
    "params.pageNum"(newVal) {
      if (newVal > 1) {
        this.showLoadMoreSpin = true;
        this._getMarkets(true);
      } else {
        this.$refs["categoryScroll"] && this.$refs["categoryScroll"].scrollTo(0, 0);
      }
    }
  },
  methods: {
    // 改摘要
    onChangeAbstracts(abstracts) {
      this.showSpin = true;
      MarketsServe.changeAbstracts({
        id: this.market.id,
        abstracts
      }).then(res => {
        this.$Message.success(res.message);
        this._getMarketInfo(this.market.id);
      });
    },


    // 搜索营销
    onSearch(keyword) {
      this.showFilterSpin = true;
      this.params.pageNum = 1;
      this.params.name = keyword;
      this._getMarkets();
    },


    onPullUp() {
      this.showLoadMoreSpin = true;
      this.params.pageNum = Math.min(this.totalPage, ++this.params.pageNum);
    },

    // 选中营销
    onSelect(item) {
      this.showSpin = false;
      this._getMarketInfo(item.id);
      this.visible = false;
//      this.$router.push({ name: 'MarketDetail', params: { id: item.id }});
    },


    // 编辑
    onEdit(type) {
      if (type === 'recipent') {
        if (!this.market.contents) {
          this.$Message.warning('Please add the text first');
          return;
        }
      }
      setStroge([{
        key: 'marketingId',
        value: this.market.id
      }, {
        key: 'marketingName',
        value: this.market.name
      }, {
        key: 'isEdit',
        value: true
      }]);
      if (type === 'contents') {
        this.$router.push("/Marketing/Contents");
      }else {
        location.href = "http://mgt.mysteelcmstest.com/mysteelglobal/group/list.htm";
      }
    },


    // more
    onOperate(type) {
      console.log(type);
      switch (type) {
         case 'testMail':
           if (this.market.contents) {
             this.showSend = true;
           }else {
             this.$Message.warning('No contents');
           }
           break;
         case 'Copy':
           this.$router.push('/Copy/' + this.market.id);
           break;
         case 'Delete':
           console.log('Delete');
           this.$Modal.confirm({
             title: "Once this email marketing is deleted, it cannot be recovered！Do you want to continue？",
             onOk: () => {
               this.showSpin = true;
               MarketsServe.deletMarkets(this.market.id).then(res => {
                 this.$Message.success(res.message);
                 this._back();
               });
             }
           });
           break;
         case 'viewReport':
           console.log('viewReport');
           break;
         case 'refresh':
           console.log('refresh');
           break;
         case 'Arrange':
           console.log('Arrange');
           this.onActArrange('rearrange');
           break;
         case 'Move to folder':
           console.log('move to folder');
           this.showMoveModal = true;
           break;
       }
    },


    // 确定copy
    onCopyConfirm(baseInfo, id) {
//      console.log('onCopyConfirm', baseInfo, id);
      MarketsServe.copyMarket({ ...baseInfo, id }).then(() => {
        this.showModal = false;
        this._back();
      });
    },

    // 确定move
    onCopyMove(id) {
      this.showSpin = true;
      MarketsServe.changeMarketCategory(id, this.market.id).then(res => {
        this.$Message.success(res.message);
        this._getMarketInfo(this.market.id);
        this._getMarkets();
      }).catch(error => {
        console.error(error);
        this.$Message.error(error.message || 'Update mail failed');
        this.showSpin = false;
      });
    },


    // 发送历史
    openHistory() {
      this.showSpin = true;
      SendServe.getTestHistories(this.market.id).then(res => {
        this.histories = res.list.map(item => item.reveiveEmail) || [];
        if (this.histories.length) {
          this.showHistory = true;
        }else {
          this.$Message.warning('no history!');
        }
        this.showSpin = false;
      });
    },


    // 发测试邮件
    onSend(receiveEmails) {
//      console.log('receiveEmails', receiveEmails);
      this.$Spin.show();
      SendServe.sendTestMail({
        marketingId: this.market.id,
        receiveEmails,
        contents: this.market.contents,
        abstracts: this.market.abstracts,
        contentFiles: this.market.contentFiles
      }).then(res => {
        this.$Message.success(res.message);
        this.$refs['testMailSend'].showHasSended = true;
        this.$Spin.hide();
      }).catch(error => {
        this.$Message.error(error.message);
        this.$Spin.hide();
      });
    },

    // 取消安排
    onActArrange(type) {
      if (type === 'rearrange') {
        setStroge([{
          key: 'isEdit',
          value: true
        }, {
          key: 'marketingId',
          value: this.market.id
        }, {
          key: 'marketingName',
          value: this.market.name
        }]);
        this.$router.push('/Marketing/SendTime');
      }else {
        this._cancel();
      }
    },

    // 重新/取消安排
    _cancel() {
      this.showSpin = true;
      SendServe.cancelStrategy(this.market.id).then(res => {
        this.$Message.success(res.message);
        this._getMarketInfo(this.market.id);
      });
    },

    _back() {
      this.$router.push('/MyMarkets');
    },

    // 获取详情
    _getMarketInfo(id) {
      MarketsServe.getMarketInfo(id).then(res => {
        // console.log('market');
        this.market = res;
        this.selectedMarket = {
          id: res.id,
          name: res.name
        }
        if (this.status[res.status] === 'arranged') {
          console.log('arranged');
          this._getStrategyInfo(id);
        }else {
          this.strategy = {};
          this.showSpin = false;
        }
      });
    },

    // 获取列表
    _getMarkets(isPull = false) {
      MarketsServe.getMarketList(this.params).then(res => {
        this.count = res.total;
        this.totalPage = res.pages;
        if (isPull) {
          this.list = this.list.concat(res.list);
          this.showLoadMoreSpin = false;
        }else{
          this.list = res.list;
        }
        this.showFilterSpin = false;
      }).catch(error => {
        console.error(error);
        this.$Message.error(error.message || 'Get market list failed');
        this.showSpin = false;
      });
    },

    // 获取发送策略的详情
    _getStrategyInfo(id) {
      SendServe.getStrategyInfo(id).then(info => {
        this.strategy = info || {};
        this.showSpin = false;
      }).catch(err => {
        console.error(err);
        this.showSpin = false;
      });
    },
  },

  created() {
    this.showSpin = true;
    this._getMarketInfo(this.id);
    this._getMarkets();
  },
 /* beforeRouteEnter (to, from, next) {
    to.params.id = 141;
    console.log('to', to);
    next();
  },*/
}
</script>
<style lang="less" scoped>
 @import "~assets/styles/variable.less";
 @import "~assets/styles/mixin.less";
  .market-detail{
    .header{
      position: relative;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: solid 1px @border-prev;
      .left{
        display: flex;
        align-items: center;
        .icon{
          margin-right: 10px;
          cursor: pointer;
        }
        .txt{
          .title{
            span{
              display: inline-block;
              font-size: @font-size-lgx;
              font-weight: bold;
              max-width: 500px;
              .no-wrap;
              vertical-align: bottom;
            }
          }
          .extras {
            display: flex;
            margin-top: 12px;
          }
        }
      }
      .deleted{
        position: absolute;
        left: 50%;
        top:-20px;
        margin-left: -50px;
      }
    }
    .contents-wrap{
      padding: 0 20px;
      display: flex;
      .left{
        padding-top: 30px;
        width: 50%;
        /*background-color: #28bebd;*/
      }
      .right{
        padding-top: 30px;
        width: 50%;
        height: 100vh;
        padding-left: 10px;
        border-left: 1px solid @border-box;
      }
    }
  }
</style>
