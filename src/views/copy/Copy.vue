<template>
  <div class="copy-market">
    <div class="header">
      <div class="title">
        <Icon type="md-arrow-back" size="22" class="icon" @click="todo('cancel')" />
        <strong>Copy the EDM</strong>
      </div>
    </div>
    <div class="copy-marketing">
      <div class="form-wrap">
        <FormWrap ref="formWrap" :market="market"></FormWrap>
      </div>
      <div class="btns">
        <Button size="large" v-btn-style class="cancel" @click="todo('cancel')">Cancel</Button>
        <Button size="large" v-btn-style="'blue'" @click="todo('save')">Save</Button>
      </div>
    </div>
    <Spin fix size="large" v-show="showSpin"></Spin>
  </div>
</template>

<script>
  import MarketsServe from '../../service/marketing/markets.service';
  import FormWrap from '../Marketing/BaseInformation/comps/form-wrap';
  export default {
    name: 'Copy',
    components: { FormWrap },
    props: ['id'],
    data() {
      return {
        market: {},
        showSpin: false
      }
    },
    methods: {
      todo(act = 'save') {
        const formWrap = this.$refs['formWrap'];
        const params = formWrap.getFormValue();
//      console.log('params', params);
        let formValid = null;
        formWrap.validator.validate({
          subject: params.subject,
          name: params.name,
          senderName: params.senderName
        }, errors => {
          formWrap.errors = errors;
          formValid = !errors;
        });
        if (act === 'save') {
          if (formValid) {
            this.showSpin = true;
            this._onConfirm(params, this.market.id);
          }else {
            this._showErrors();
          }
        }else{  // cancel
          this._back();
        }
      },

      _onConfirm(baseInfo, id) {
        this.showSpin = true;
        MarketsServe.copyMarket({ ...baseInfo, id }).then(res => {
          this.$Message.success(res.message || 'Copy Success');
          this._back();
        }).catch(err => {
          console.error("err :", err);
          this.$Message.error(err.message || 'Copy Fail');
          this.showSpin = false;
        });
      },

      _showErrors() {
        const errors = this.$refs['formWrap'].errors;
        for (const attr in errors) {
          if (!errors[attr].valid) {
            errors[attr].isDirty = true;
            errors[attr].showErrors = true;
          }
        }
      },


      _marketInfo(id) {
        MarketsServe.getMarketInfo(id).then(info => {
          this.market = info;
          this.showSpin = false;
        })
      },
      _back() {
        this.$router.back();
      }
    },
    created() {
      if (this.id) {
        this.showSpin = true;
        this._marketInfo(this.id);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/styles/variable";
  .copy-market {
    position: relative;
    .header .title{
      font-size: @font-size-lg;
      .icon{
        vertical-align: text-bottom;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .copy-marketing{
      position: relative;
      min-height: 600px;
      .form-wrap{
        width: 900px;
        margin: 0 auto;
      }
      .btns{
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
        .cancel{
          margin-right: 10px;
        }
      }
    }
  }
</style>
