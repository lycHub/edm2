<template>
  <div class="market-info">
    <Alert type="warning" class="alert" v-show="showRearrange">
      <div class="warning">
        <p>
          <Icon custom="i-icon icon-qiandao" size="20" class="icon"/>
          Marketing time {{strategy.realTime | format}}{{strategy.timeZone}}.
        </p>
        <div class="acts" slot="desc">
          <span @click="arrangeAct('rearrange')">Rearrange</span>
          <span @click="arrangeAct">Cancel</span>
        </div>
      </div>
    </Alert>
    <em>Marketing information</em>
    <div class="wrap">
      <div class="item">
        <label>Subject</label>
        <span v-html="emojiParse(market.subject)"></span>
      </div>

      <div class="item">
        <label>Sender's name</label>
        <span>{{market.senderName}}</span>
      </div>

      <div class="item">
        <label>Sender's email</label>
        <span>{{market.senderEmail}}</span>
      </div>

      <div class="item">
        <label>Reply emails to</label>
        <span>{{market.replyEmail}}</span>
      </div>

      <!-- <div class="item">
        <label>Personalized recipients</label>
        <span>No</span>
      </div>

      <div class="item">
        <label>Trace option</label>
        <span>Google Analytics - Not Configured</span>
      </div>

      <div class="item">
        <label>Other option</label>
        <span>UTF-8</span>
      </div>-->

      <div class="item recipients">
        <label>Recipients' information</label>
        <div class="list" v-if="receives.length">
          <ul>
            <li v-for="(item, index) in receives" :key="index">
              <Icon custom="i-icon icon-dianhuabu" />
              <span>{{item.reveiveName}}</span>
            </li>
          </ul>

          <template v-if="receiveTotalPage > 1">
            <span class="three-more" v-if="!isLastPage" @click="onPullUp">3 more...</span>
            <span class="three-more" v-else @click="receiveParams.pageNum = 1">hide information</span>
          </template>
          <p class="receiver-count">Subscribers already sent
            <b>{{receiveCount}}</b>
          </p>
          <Spin v-if="requestReceiveing" fix></Spin>
        </div>
        <Button v-btn-style="'green'" @click="onAddContacts" v-else>Add contacts</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmptyObj, setStroge, toDate, uniq } from "../../../utils/tool";
import { isAfter } from "date-fns";
import SendServe from '../../../service/marketing/send.service';

export default {
  name: "MarketInfo",
  props: {
    market: {
      type: Object,
      default: {}
    },
    strategy: Object
  },
  data() {
    return {
      // 收件人参数
      receiveParams: {
        pageNum: 1,
        pageSize: 3,
        marketingId: null
      },

      receiveCount: 0,
      receiveTotalPage: 0,
      isLastPage: false,
      receives: [],

      requestReceiveing: false
    };
  },
  computed: {
    showRearrange() {
//      console.log('strategy', this.strategy);
      return (!isEmptyObj(this.strategy) && isAfter(toDate(this.strategy.realTime), new Date()));
    }
  },

  watch: {
    "receiveParams.pageNum"(newVal) {
      this.requestReceiveing = true;
      this._getReceiverList(newVal > 1);
    },
    market(newVal) {
      // console.log("market :", newVal);
      if (newVal.id) {
        this.receiveParams.marketingId = newVal.id;
        this._getReceiverList();
      }
    }
  },

  methods: {
    onAddContacts() {
      // console.log('contents :', this.market.contents);
      if (!this.market.contents) {
        this.$Message.warning('Please add the text first');
      }else {
        setStroge([
          {
            key: "marketingId",
            value: this.market.id
          },
          {
            key: "marketingName",
            value: this.market.name
          }
        ]);
        location.href = "http://mgt.mysteelcmstest.com/mysteelglobal/group/list.htm";
      }
    },

    arrangeAct(type) {
      const txt = type === "rearrange" ? "rearrange" : "cancel";
      this.$Modal.confirm({
        title: "Do you want to " + txt + " the EDM?",
        okText: "Continue",
        cancelText: "No",
        onOk: () => {
          this.$emit("on-actArrange", txt);
        }
      });
    },

    // 更多收件人
    onPullUp() {
      this.receiveParams.pageNum = Math.min(this.receiveTotalPage, ++this.receiveParams.pageNum);
    },

    _getReceiverList(isPull = false) {
      SendServe.getReceiverList(this.receiveParams).then(receivers => {
        // console.log('receivers :', receivers);
          this.isLastPage = receivers.isLastPage;
          this.receiveCount = receivers.total;
          this.receiveTotalPage = receivers.pages;
          const list = receivers.list || [];
          if (isPull) {
            this.receives = this.receives.concat(list);
          }else{
            this.receives = list;
          }
          this.requestReceiveing = false;
          this.$emit('count-receiver', receivers.total || 0);
        }).catch(error => {
            console.error(error);
            this.$emit('count-receiver', 0);
            this.requestReceiveing = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../assets/styles/variable";
.market-info {
  .alert {
    .warning {
      text-align: center;
      p {
        font-size: @font-size-normal;
        .icon {
          vertical-align: middle;
          margin-right: 5px;
        }
      }
      .acts {
        margin-top: 10px;
        span {
          display: inline-block;
          color: @font-color-primary;
          cursor: pointer;
          margin-right: 20px;
        }
      }
    }
  }
  em {
    display: block;
    font-size: @font-size-lg;
    margin-bottom: 25px;
  }
  .wrap {
    .item {
      display: flex;
      font-size: @font-size-normal;
      margin-bottom: 15px;
      label {
        display: inline-block;
        min-width: 200px;
        color: @color-black;
      }
      &.recipients {
        display: flex;
        .list {
          position: relative;
          ul {
            /*max-height: 520px;
              overflow-y: auto;*/
            li {
              margin-bottom: 8px;
              span {
                margin-left: 5px;
                vertical-align: bottom;
              }
            }
          }
          .three-more {
            display: block;
            color: @font-color-primary;
            cursor: pointer;
            margin-top: 5px;
          }
          .receiver-count {
            margin-top: 30px;
          }
        }
      }
    }
  }
}
</style>
