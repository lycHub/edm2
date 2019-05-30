<template>
  <div class="test-preview">
    <div class="header clearfix">
      <span>Preview & Test</span>
      <Icon type="ios-close" size="30" class="icon-close" @click="$router.go(-1)"/>
    </div>

    <div class="wrap">
      <div class="preview">
        <TestMailPreview
          slot="preview"
          :delFile="false"
          :initMode="$route.query.mode"
          :contents="testPreview.contents"
          :abstracts="market.abstracts"
          :contentFiles="testPreview.contentFiles"
          @on-change-abstracts="onChangeAbstracts">
        </TestMailPreview>
      </div>
      <div class="test">
        <TestMailSend ref="testMailSend" slot="send" @on-show-history="openHistory" @on-send="onSend"></TestMailSend>
      </div>
    </div>

    <!-- 发送历史 -->
    <TestMailHistory v-model="showHistory" :list="histories"></TestMailHistory>

    <Spin size="large" fix v-if="showSpin"></Spin>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import MarketsServe from '../../../service/marketing/markets.service';
import SendServe from '../../../service/marketing/send.service';
import { isEmptyObj } from '../../../utils/tool';

export default {
  name: "TestPreview",
  data() {
    return {
      showHistory: false,
      showSpin: false,
      histories: []
    };
  },
  computed: mapGetters(['market', 'testPreview']),
  watch: {
    testPreview(newVal) {
      console.log('testPreview :', newVal);
    }
  },
  methods: {
    onChangeAbstracts(abstracts) {
      this.showSpin = true;
      console.log("abstracts :", abstracts);
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

    // 发测试邮件
    onSend(receiveEmails) {
//      console.log('receiveEmails', receiveEmails);
      this.showSpin = true;
      SendServe.sendTestMail({
        abstracts: this.market.abstracts,
        marketingId: this.market.id,
        receiveEmails,
        ...this.testPreview
      }).then(res => {
        this.$Message.success(res.message);
        this.$refs['testMailSend'].showHasSended = true;
        this.showSpin = false;
      }).catch(error => {
        this.$Message.error(error.message);
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
    ...mapMutations(['SET_MARKET'])
  },
  mounted() {
    setTimeout(() => {
      console.log('testPreview xxx:', this.testPreview);
      if (isEmptyObj(this.testPreview)) {
        this.$router.push("/Marketing/Contents");
      }
    }, 1000);
  }
 /*  beforeRouteLeave (to, from, next) {
    this.SET_TEST_PREVIEW('');
    next();
  } */
};
</script>

<style lang="less" scoped>
@import "~assets/styles/variable";
.test-preview {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  right: 0;
  bottom: 0;
  background-color: @color-white;

  .header{
      // border-bottom: 1px solid @border-prev;
      padding: 15px;
      span{
        float: left;
        font-size: @font-size-lg;
      }
      .icon-close{
        float: right;
        cursor: pointer;
      }
    }
    .wrap{
      display: flex;
      .preview{
        width: 50%;
      }
      .test{
        width: 50%;
        min-width:630px;
        padding: 0 25px;
      }
    }
}
</style>
