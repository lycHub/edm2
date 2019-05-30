<template>
  <div class="test-wrap">
    <div class="send" v-if="!showHasSended">
      <h3 v-show="showTitle">Test email</h3>
      <div class="select">
        <MultipleSelect
          :datas="emails"
          :value="receiveEmails"
          :visible="visib"
          :showSpin="showFilterSpin"
          :showLoadMoreSpin="showLoadMoreSpin"
          @on-filter="onFilter"
          @on-pull-up="onPullUp"
          @on-visible-change="visib = $event"
          @on-add="onAddEmail"
          @on-change="receiveEmails = $event">
        </MultipleSelect>
      </div>
      <p class="tip">At most 5 email addresses.</p>
      <div class="send">
        <Button class="btn" v-btn-style="'blue'" @click="onSendEmail">Send test email</Button>
        <span @click="$emit('on-show-history')">（View the history）</span>
      </div>
    </div>
    <TestMailSended v-else @on-action="onAction" :list="receiveEmails"></TestMailSended>
  </div>
</template>

<script>
import axios from 'axios';
import EmailServe from '../../../service/marketing/email.service';
import TestMailSended from './test-mail-sended';
export default {
  name: "TestMailSend",
  components: { TestMailSended },
  props: {
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visib: false,
      params: {
        pageNum: 1,
        pageSize: 8,
        email: ''
      },
      emails: [],
      count: 0,
      totalPage: 0,
      receiveEmails: [],
      showLoadMoreSpin: false,
      showFilterSpin: false,
      scroll: null,

      // 显示已发送面板
      showHasSended: false
    };
  },
  watch: {
    showHasSended(newVal) {
      console.log('showHasSended :', newVal);
      if (newVal) {
        this.receiveEmails = [];
      }
    },
    'params.email'() {
      this.params.pageNum = 1;
      this.showFilterSpin = true;
      this._getEmails();
    },
    'params.pageNum'(newVal) {
      // console.log('pageNum :', newVal);
      if (newVal > 1) {
        this.showLoadMoreSpin = true;
        this._getEmails(true);
      }else {
        this.scroll.scrollTo(0, 0);
      }
    }
  },
  methods: {
    // 发邮件
    onSendEmail() {
      if (this.receiveEmails.length) {
        this.$emit('on-send', this.receiveEmails);
      }else {
        this.$Message.warning('select email please');
      }
    },

    onFilter(q) {
      this.params.email = q;
    },
    onPullUp(scroll) {
      this.scroll = scroll;
      this.params.pageNum = Math.min(this.totalPage, ++this.params.pageNum);
    },
    onAddEmail(email) {
      this.showFilterSpin = true;
      EmailServe.addEmail({ email }, true).then(res => {
        this.$Message.success(res.message);
        this.params.pageNum = 1;
        // this.params.email = '';
        this._getEmails();
      }).catch(err => {
        console.log('err add:', err);
        this.$Message.error(err.message);
        this.showFilterSpin = false;
      });
    },

    // 已发送面板的点击事件
    onAction(act) {
      if (act === 'history') {
        this.$emit('on-show-history');
      }else {
        this.showHasSended = false;
      }
    },

    _getEmails(isPull = false) {
      EmailServe.getEmails(this.params, true).then(res => {
        this.count = res.total;
        this.totalPage = res.pages;
        if (isPull) {
          this.emails = this.emails.concat(res.list);
        } else {
          this.emails = res.list;
        }
        // console.log('emails :', this.emails);
        this.showLoadMoreSpin = false;
        this.showFilterSpin = false;
      });
    }
  },
  created() {
    this._getEmails();
  }
};
</script>

<style lang="less" scoped>
@import "../../../assets/styles/variable";
.test-wrap {
 /*  width: 890px;
  margin: 0 auto; */
  h3 {
    font-size: @font-size-mid;
  }
  .select {
    /*position: relative;*/
    margin: 20px 0;
  }
  .tip{
    margin-bottom: 20px;
    color: @font-color-tip;
  }
  .send {
    .btn {
      background-color: @bg-btn-primary;
      color: @color-white;
      font-size: @font-size-mid;
    }
    > span {
      color: @color-primary;
      cursor: pointer;
      font-size: @font-size-normal;
      margin-left: 8px;
    }
  }
}
</style>
