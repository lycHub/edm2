<template>
  <div class="send-time">
    <div class="wrap">
      <ChooseTime v-if="!showConfirmTime" @on-strategy="onStrategy"></ChooseTime>
      <ConfirmTime
        v-else
        :batchLen="receives.length"
        :timeZones="timeZones"
        :strategy="strategy"
        @on-arrange="onArrange"
        @on-cancel="strategy = null">
      </ConfirmTime>

      <div class="info">
        <Card class="card base" title="Subject & sender's information">
          <router-link to="/Marketing" slot="extra" replace>
            <Button type="primary" ghost>Edit</Button>
          </router-link>
          <!--<CellGroup class="cell-group">
            <Cell title="Subject" :extra="market.subject" />
            <Cell title="Sender" :extra="market.senderName" />
            <Cell title="Sender's email" :extra="market.senderEmail" />
            <Cell title="Reply email to" :extra="market.replyEmail" />
          </CellGroup>-->
          <ul>
            <li>
              <label>Subject</label>
              <span v-html="emojiParse(market.subject)"></span>
            </li>
            <li>
              <label>Sender</label>
              <span>{{market.senderName}}</span>
            </li>
            <li>
              <label>Sender's email</label>
              <span>{{market.senderEmail}}</span>
            </li>
            <li>
              <label>Reply email to</label>
              <span>{{market.replyEmail}}</span>
            </li>
          </ul>
        </Card>

        <Card class="card abstract" title="Abstract">
          <!--market.abstracts-->
          <CellGroup class="cell-group" v-if="!market.abstracts">
            <Cell class="cell" label="You did not add the summary"/>
            <Button
              size="small"
              class="btn"
              v-btn-style="'blue'"
              @click="abstractModal = true"
            >Add abstract</Button>
          </CellGroup>
          <CellGroup class="cell-group" v-else>
            <Cell class="cell" :label="market.abstracts"/>
            <Button
              size="small"
              class="btn"
              v-btn-style="'blue'"
              @click="abstractModal = true"
            >Edit abstracts</Button>
          </CellGroup>
        </Card>

        <Card class="card content" title="Content information">
          <router-link to="/Marketing/Contents" slot="extra" replace>
            <Button type="primary" ghost>Edit</Button>
          </router-link>
          <CellGroup class="cell-group">
            <Cell label="You have successfully created the content　|" class="cell" />
            <Button type="text" class="btn" @click="previewModal = true">Preview</Button>
          </CellGroup>
        </Card>

        <Card class="card recipients" title="Recipients' information">
          <Button type="primary" ghost slot="extra">
            <a href="http://mgt.mysteelcmstest.com/mysteelglobal/group/list.htm" target="_blank">Edit</a>
          </Button>
          <div class="list-wrap">
            <label>EDM sent to following subscribers：</label>
            <ul>
              <li v-for="(item, index) in receives" :key="index">
                {{item.reveiveName + '(' + item.groupName + ')'}}
                <i v-show="index < receives.length - 1">，</i>
              </li>
              <div class="action" v-show="receiveTotalPage > 1">
                <span @click="onPullUp" v-if="!isLastPage">more</span>
                <span @click="receiveParams.pageNum = 1" v-else>retract</span>
              </div>
            </ul>
            <Spin v-if="requestReceiveing" fix></Spin>
          </div>
        </Card>


      </div>
    </div>

    <!-- 摘要弹窗 -->
    <Abstract :abstracts="market.abstracts" v-model="abstractModal" @on-change="onChangeAbstracts"></Abstract>

    <!-- 预览弹窗 -->
    <Modal v-model="previewModal" :closable="false" footer-hide>
      <!--<Preview
        :showAbstract="false"
        :contents="market.contents"
        :contentFiles="market.contentFiles"
        @on-change-abstracts="onChangeAbstracts"
        @on-delete-file="onDeleteFile">
      </Preview>-->
      <TestMailPreview
        :showAbstracts="false"
        :contents="market.contents"
        :contentFiles="market.contentFiles"
        @on-delete-file="onDeleteFile"
        @on-change-abstracts="onChangeAbstracts">
      </TestMailPreview>
    </Modal>

    <!-- 发送弹窗 -->
    <ConfirmModal
      v-model="showConfirmModal"
      :imgTxt="imgTxt"
      @on-action="onAction"
      :isSendNow="strategy && strategy.title === 'Send at now'"
      ref="confirmModal">
    </ConfirmModal>
    <Spin size="large" v-if="showSpin" fix style="z-index: 2000;"></Spin>
  </div>
</template>

<script>
import ChooseTime from "./comps/choose-time/choose-time.vue";
import ConfirmTime from "./comps/confirm-time";
import ConfirmModal from "./comps/confirm-modal";
import { mapGetters, mapMutations } from "vuex";
import MarketsServe from "../../../service/marketing/markets.service";
import CommonServe from "../../../service/marketing/common.service";
import SendServe from "../../../service/marketing/send.service";
import FileServe from "../../../service/marketing/file.service";
import {COMPLETESTATUTS, OPERATES as operates, STRAREGY} from "../../../configs/enums";
import img_send_wran from '../../../assets/images/send_wran.png'
import img_sending_box from '../../../assets/images/sending_box.png'
import img_clock from '../../../assets/images/clock.png'
import img_arranged_mail from '../../../assets/images/arranged_mail.png'
import {isEmptyObj} from "../../../utils/tool";
import axios from 'axios';

const confirmModalImgTxt = [{   // Send at now
  sendBefore: {
    pic: img_send_wran,
    title: 'Send the marketing mailing now?',
    desc: ''
  },
  sendAfter: {
    pic: img_sending_box,
    title: 'Sending your marketing mailings now ...',
    desc: ''
  }
}, {                      // others
  sendBefore: {
    pic: img_clock,
    title: 'We are ready to arrange your marketing',
    desc: ''
    //  within 24 hours when the recipient is most likely to open it.   2-3
  },
  sendAfter: {
    pic: img_arranged_mail,
    title: 'congratulations',
    desc: 'You have successfully arranged your marketing.'
  }
}];

export default {
  name: "SendTime",
  components: {
    ChooseTime,
    ConfirmTime,
    ConfirmModal
  },
  data() {
    return {
      abstractModal: false,
      previewModal: false,
      showSpin: false,
      strategy: null,
      showConfirmModal: false,

      // 发送弹窗的图文描述
      imgTxt: {},
      strategyArr: STRAREGY,
      timeZones: [],
      testNum: 3,

      // 收件人参数
      receiveParams: {
        pageNum: 1,
        pageSize: 4,
        marketingId: null
      },

      receiveCount: 0,
      receiveTotalPage: 0,
      isLastPage: false,
      receives: [],

      // 是否正在请求收件人列表
      requestReceiveing: false
    };
  },
  // receiverList  receiverName
  computed: {
    showConfirmTime() {
      return this.strategy && this.strategy.title !== 'Send at now';
    },
    ...mapGetters(["market", "stepIndex", "operate", "completedStep"])
  },
  watch: {
    // 监听操作
    operate(newVal) {
      this._todo(newVal);
    },
    showConfirmModal(newVal) {
      if (!newVal) {
        this.imgTxt = {};
        this.$refs['confirmModal'].completed = false;
      }
    },
    market: {
      handler(newVal) {
        console.log('market w', newVal);
        if (newVal.id) {
          this.showSpin = true;
          this.receiveParams.marketingId = newVal.id;
          this._initDatas();
        }
      },
      immediate: true
    },
    'receiveParams.pageNum'(newVal) {
      this.requestReceiveing = true;
      this._getReceiverList(newVal > 1);
    },
    /*strategy(newVal) {
      console.log('strategy', newVal);
    }*/
  },
  methods: {
    onChangeAbstracts(abstracts) {
      this.showSpin = true;
      // console.log("abstracts :", abstracts);
      const params = {
        id: this.market.id,
        abstracts
      };
      MarketsServe.changeAbstracts(params).then(res => {
        console.log("edit abs :", res);
        this.SET_MARKET({ abstracts });
        this.showSpin = false;
      });
    },

    // 更多收件人
    onPullUp() {
      this.receiveParams.pageNum = Math.min(this.receiveTotalPage, ++this.receiveParams.pageNum);
    },

    // 删附件
    onDeleteFile(id) {
      this.showSpin = true;
      FileServe.deleteFile(id).then(res => {
        const contentFiles = this.market.contentFiles.slice();
        const index = contentFiles.findIndex(item => item.id === id);
        contentFiles.splice(index, 1);
        this.SET_MARKET({ contentFiles });
        this.$Message.success(res.response || 'ok');
        this.showSpin = false;
      });
    },

    // 选中哪个策略
    onStrategy(strategy) {
//      console.log('strategy :', strategy);
      this.strategy = strategy;
      if (this.strategyArr[strategy.id] === 'Send at now') {
        // console.log('Send at now');
        this.imgTxt = confirmModalImgTxt[0].sendBefore;
        this.showConfirmModal = true;
      }
    },

    // 安排
    onArrange(params) {
      this.arrangeParams = {
        marketingId: this.market.id,
        ...params
      }
      this.imgTxt = {...confirmModalImgTxt[1].sendBefore};
      this.imgTxt.desc = this._getDesc(this.arrangeParams);
      // console.log('desc :', this.imgTxt.desc);
      this.showConfirmModal = true;
    },

    // 获取发送弹窗的desc
    _getDesc(params) {
      let desc = '';
      if (this.strategyArr[this.strategy.id] === 'Best opening time for recipients') {
        desc = 'within 24 hours when the recipient is most likely to open it.'
      }else {
        desc = 'at ' + params.date + ' ' + params.time + ' ' + params.timeZone
      }
      return desc;
    },


     // 发送弹窗的操作（确认或跳转详情）
    onAction(act) {
      console.log('act :', act);
      if (act === 'continue') {
        if (this.strategy.title === 'Send at now') {
          this._sendNow();
        }else {
          console.log('arrangeParams :', this.arrangeParams);
          this._arrange(this.arrangeParams);
        }
      }else{
        // console.log('view detail');
        this._todo(operates.SAVETODETAIL);
      }
    },


    // 立即发送
    _sendNow() {
      // console.log('_sendNow');
      this.showSpin = true;
      SendServe.sendAtNow(this.market.id).then(res => {
        this.$refs['confirmModal'].completed = true;
        this.$Message.success(res.message);
        this.showSpin = false;
      }).catch(error => {
        this.$Message.error(error.message || 'Send fail');
        this.showSpin = false;
      });
    },


    // 安排发送
    _arrange(params) {
      this.showSpin = true;
      SendServe.arrangeStrategy(params).then(res => {
        this.$refs['confirmModal'].completed = true;
        this.$Message.success(res.message);
        this.showSpin = false;
      }).catch(error => {
        this.$Message.error(error.message || 'Arrange fail');
        this.showSpin = false;
      });
    },

    _todo(operate) {
//      console.log("operate :", operate);
      switch (operate) {
        case operates.LAST:
          this.SET_STEP_INDEX(2);
          break;
        case operates.SAVETOLIST:
          this.$router.push("/MyMarkets");
          break;
        case operates.SAVETODETAIL:
          this.$router.push("/MarketDetail/" + this.market.id);
          break;
      }
    },
    _formatTimeZone(arr) {
      const result = [];
      for(const value of arr) {
        result.push({
          title: Object.keys(value)[0],
          offset: Object.values(value)[0]
        });
      }
      return result;
    },

    _getReceiverList(isPull = false, isFirst = false) {
      console.log('aa _getReceiverList');
      const server = SendServe.getReceiverList(this.receiveParams);
      if (isFirst) {
        return server;
      }else {
        server.then(receivers => {
          this.isLastPage = receivers.isLastPage;
          const list = receivers.list || [];
          if (isPull) {
            this.receives = this.receives.concat(list);
          }else{
            this.receives = list;
          }
          this.requestReceiveing = false;
        });
      }
    },

    _initDatas() {
      axios.all([this._getReceiverList(false, true), CommonServe.getTimeZones()])
      .then(axios.spread((receivers, timezone) => {
        this.receiveCount = receivers.total;
        this.receiveTotalPage = receivers.pages;
        this.isLastPage = receivers.isLastPage;
        this.receives = receivers.list || [];
        this.timeZones = this._formatTimeZone(timezone);
        // console.log('timeZones :', this.timeZones);
        this.showSpin = false;
      }));
    },

    ...mapMutations(["SET_MARKET", "SET_STEP_INDEX", "SET_OPERATE"])
  }
};
</script>

<style lang="less" scoped>
@import "../../../assets/styles/variable";
@import "../../../assets/styles/mixin";
.send-time {
  position: relative;
  min-height: 980px;
  .wrap {
    padding: 0 40px;

    .info {
      .card {
        margin-bottom: 20px;
        ul {
          li{
            margin-top: 10px;
            label{
              display: inline-block;
              width: 180px;
            }
          }
        }


        &.abstract .cell-group {
          display: flex;
          align-items: center;
          .btn {
            margin-left: 20px;
          }
        }

        &.content {
          .cell-group {
            .cell {
              display: inline-block;
              padding-right: 0;
            }
            .btn {
              vertical-align: bottom;
              color: @color-primary;
              padding-left: 10px;
            }
          }
        }

        &.recipients{
          margin-bottom: 80px;
          .list-wrap{
            position: relative;
            display: flex;
            align-items: baseline;
            label{
              display: block;
              min-width: 240px;
            }
            ul{
              display: flex;
              /*max-width: 760px;*/
              /*height:16px;*/
              flex-wrap: wrap;
              /*overflow: hidden;*/

              .action{
                color: @color-primary;
                cursor: pointer;
                margin-left: 10px;
                margin-top: 10px;
              }
            }
          }

        }
      }
    }
  }
}
</style>
