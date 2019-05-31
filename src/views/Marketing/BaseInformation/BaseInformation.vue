<template>
  <div class="create-marketing">
    <div class="form-wrap">
      <FormWrap ref="formWrap" :market="market"></FormWrap>
    </div>
    <Spin fix size="large" v-show="showSpin"></Spin>
  </div>
</template>

<script>
import FormWrap from './comps/form-wrap';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import {COMPLETESTATUTS, OPERATES as operates} from '../../../configs/enums';
import MarketsServe from '../../../service/marketing/markets.service';
import {setStroge} from "../../../utils/tool";

export default {
  name: 'BaseInformation',
  components: {
    FormWrap
  },
  data() {
    return {
      showSpin: false
    }
  },
  computed: mapGetters(['operate', 'market', 'completedStep']),
  watch: {
    // 监听操作
    operate(newVal) {
      this._todo(newVal);
    },
  },
  methods: {
    _todo(operate) {
      console.log('operate1 :', operate);
      const id = localStorage.getItem('marketingId');
      const formWrap = this.$refs['formWrap'];
      const params = formWrap.getFormValue();
     /* console.log('params', params);
     this.SET_OPERATE(operates.FREE);
     return; */
      let formValid = null;
      formWrap.validator.validate({
        subject: params.subject,
        name: params.name,
        senderName: params.senderName
      }, errors => {
        formWrap.errors = errors;
        formValid = !errors;
      });
//      console.log('formValid', formValid);
      /*this.SET_OPERATE(operates.FREE);
      return;*/

      switch(operate) {
        case operates.NEXT:
          if (formValid) {
            if (id) {
              this._editMarket({ ...params, id }, () => {
                // console.log('next11');
                setStroge({
                  key: 'marketingName',
                  value: params.name
                });
                this.saveToNext({
                  market: { ...params, id },
                  stepIndex: 1
                });
              });
            }else{
              this._createMarket(params, res => {
                setStroge([{
                  key: 'marketingId',
                  value: res.response
                }, {
                  key: 'marketingName',
                  value: params.name
                }]);
                // console.log('create ok res :', res);
//                console.log('next completedStep', this.completedStep);
                if (this.completedStep === COMPLETESTATUTS.EMPTY) {
                  this.SET_COMPLETED_STEP(COMPLETESTATUTS.BASE);
                }
                this.saveToNext({
                  market: {
                    id: res.response, // res.response后台返回的id
                    ...params
                  },
                  stepIndex: 1
                });
              });
            }
          }else {
            this.SET_OPERATE(operates.FREE);
//            this._showErrors();
          }
          break;
        case operates.SAVETOLIST:
          if (formValid) {
            if (id) {
              this._editMarket({ ...params, id }, () => this._resetState());
            }else {
              // this._createMarket(params);
              this._createMarket(params, () => this._resetState());
            }
          }else {
            this.SET_OPERATE(operates.FREE);
//            this._showErrors();
          }
          break;
        case operates.SAVETODETAIL:
          if (formValid) {
            if (id) {
              this._editMarket({ ...params, id }, () => this._resetState('/MarketDetail/' + id));
            }else {
              // this._createMarket(params);
              this._createMarket(params, res => this._resetState('/MarketDetail/' + res.response));
            }
          }else {
            this.SET_OPERATE(operates.FREE);
//            this._showErrors();
          }
          break;
        case operates.CANCEL:
          this._resetState();
          break;
      }
    },
    /*_showErrors() {
      const errors = this.$refs['formWrap'].errors;
      for (const attr in errors) {
        if (!errors[attr].valid) {
          errors[attr].isDirty = true;
          errors[attr].showErrors = true;
        }
      }
    },*/
    _createMarket(params, cb) {
      // console.log('_createMarket params :', params);
      this.showSpin = true;
      MarketsServe.addMarket(params).then(res => {
        if (cb) cb(res);
        this.showSpin = false;
      }).catch(error => {
        console.error(error);
        this.$Message.error(error.message || 'Create mail failed');
        this.SET_OPERATE(operates.FREE);
        this.showSpin = false;
      });
    },
    _editMarket(params, cb) {
      this.showSpin = true;
      MarketsServe.editMarket(params).then(res => {
        if (cb) cb(res);
        this.showSpin = false;
      }).catch(error => {
        console.error(error);
        this.$Message.error(error.message || 'Update mail failed');
        this.SET_OPERATE(operates.FREE);
        this.showSpin = false;
      });
    },
    _resetState(to = '/MyMarkets') {
      /*this.resetStore().then(_ => {
        this.$router.push(to);
      });*/
      this.$router.push(to);
    },
    ...mapMutations(['SET_OPERATE', 'SET_STEP_INDEX', 'SET_COMPLETED_STEP']),
    ...mapActions(['saveToNext'])
  },
  created() {
    if (this.stepIndex !== 0) {
      this.SET_STEP_INDEX(0);
    }
    // console.log('base operate', this.operate);
    /* request.post('/marketingcategory/list', {
      name: '',
      pageNum: 1,
      pageSize: 10
    }).then(res => {
      console.log('res cccc:', res);
    }) */
  },
}
</script>

<style lang="less" scoped>
  .create-marketing {
    min-height: 680px;
    .form-wrap{
      width: 900px;
      margin: 0 auto;
    }
  }
</style>
