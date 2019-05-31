<template>
  <div class="marketing">
    <Row class="header" type="flex" justify="space-between" align="middle">
      <i-Col span="4">
      <span class="title">{{market.name}}</span>
      </i-Col>
      <i-Col span="16">
      <div class="steps">
        <ul>
          <li v-for="(item, index) in steps" :key="item.name" :class="{'active': currentRouteIndex >= index}" @click="changeStep(index)" v-highlight>{{item.label}}</li>
        </ul>
      </div>
      </i-Col>
      <i-Col span="4">
      <div class="save">
        <Button class="btn txt" v-btn-style @click.native="saveTo('SAVETODETAIL')">Save & Exit</Button>
        <Dropdown placement="bottom-end" trigger="click">
          <Button class="btn arrow" v-btn-style>
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem class="save-item" v-highlight @click.native="saveTo('SAVETOLIST')">Save and go to list view</DropdownItem>
            <!--<DropdownItem class="save-item" v-highlight>save and trun to dashboard</DropdownItem>-->
          </DropdownMenu>
        </Dropdown>
      </div>
      </i-Col>
    </Row>
    <transition
      mode="out-in"
      duration="300"
      :enter-active-class="enterActiveClass"
      :leave-active-class="leaveActiveClass">
      <router-view />
    </transition>
    <footer class="footer">
      <div class="btns">
        <Button v-btn-style @click="goLast" size="large" v-if="stepIndex > 0">Previous</Button>
        <Button v-btn-style size="large" v-else @click="onCancel">Cancel</Button>
        <Button v-btn-style="'green'" @click="goNext" v-show="showNextStep" size="large">Next step</Button>
      </div>
    </footer>
    <Spin size="large" fix v-if="showSpin"></Spin>
  </div>
</template>

<script>
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  import {COMPLETESTATUTS, OPERATES as operates} from '../../configs/enums'
  import MarketsServe from '../../service/marketing/markets.service'
  import SendServe from '../../service/marketing/send.service'
  import { throttle } from "throttle-debounce";
  import {isEmptyObj, removeStroge} from '../../utils/tool';

  export default {
    name: 'Marketing',
    data() {
      return {
        showSpin: false,
        enterActiveClass: '',
        leaveActiveClass: '',
        steps: [{
          name: 'BaseInformation',
          label: '1 Basic information'
        }, {
          name: 'Contents',
          label: '2 Contents'
        }, {
          name: 'Recipients',
          label: '3 Recipients'
        }, {
          name: 'SendTime',
          label: '4 Sending time'
        }]
      }
    },
    computed: {
      routerMeta() {
        return this.$route.meta;
      },
      breadcrumbs() {
        return this.routerMeta.breadcrumb || []
      },
      currentRouteIndex() {
        return this.steps.findIndex(item => item.name === this.breadcrumbs[2].name);
      },
      showNextStep() {
        return !this.routerMeta.hideLastStep;
      },

      ...mapGetters(['market', 'stepIndex', 'completedStep'])
    },
    watch: {
      stepIndex(newVal) {
        // console.log('stepIndex', newVal);
        if (this.reseting) return;
        if (newVal === 2) {
          location.href = "http://mgt.mysteelcmstest.com/mysteelglobal/group/list.htm";
          return;
        }
        if (this.steps[newVal]) {
          if (newVal < this.currentRouteIndex) {
            this.enterActiveClass = 'animated slideInLeft';
            this.leaveActiveClass = 'animated slideOutRight';
          }else {
            this.enterActiveClass = 'animated slideInRight';
            this.leaveActiveClass = 'animated slideOutLeft';
          }
          this.$router.push({ name: this.steps[newVal].name || 'BaseInformation' });
        }
      },
      /*currentRouteIndex(newVal) {
        console.log('currentRouteIndex :', newVal);
        if (this.completedStep !== newVal) {
          this.$router.push({ name: this.steps[newVal].name });
        }
      },*/
      completedStep(newVal) {
        console.log('completedStep :', newVal);
      },
     /*  market(newVal) {
        console.log('market', newVal);
      } */
    },
    methods: {
      changeStep(index) {
      /*  this.SET_STEP_INDEX(index);
        return;*/
        if ((!this.completedStep && this.completedStep !== 0) || (index - this.completedStep) > 1) {
          return;
        }else {
          this.SET_OPERATE(operates.FREE);
          this.SET_STEP_INDEX(index);
        }
      },
      goLast() {
        this.go(operates.LAST);
      },
      goNext() {
        this.go(operates.NEXT);
      },

      // 返回列表或详情
      saveTo(to = 'SAVETOLIST') {
        this.SET_OPERATE(operates[to]);
      },

      onCancel() {
        this.SET_OPERATE(operates.CANCEL);
      },

      _getMarketInfo(id) {
        MarketsServe.getMarketInfo(id).then(info => {
//          console.log('getMarketInfo', info);
          const step = info.contents ? COMPLETESTATUTS.CONTENTS : COMPLETESTATUTS.BASE;
          this.SET_COMPLETED_STEP(step);
          this.SET_MARKET(info);

          this._getReceivers({
            pageNum: 1,
            pageSize: 1,
            marketingId: info.id
          });
        }).catch(error => {
          console.error(error);
        });
      },

      _getReceivers(params) {
        SendServe.getReceiverList(params).then(receivers => {
          if (receivers.total) {
            this.SET_COMPLETED_STEP(COMPLETESTATUTS.RECIPIENTS);
          }
          this._resetPage();
          this.showSpin = false;
        }).catch(error => {
          console.error('errors', error);
          this._resetPage();
          this.showSpin = false;
        });
      },

      // 不能直接进某一步
      _resetPage() {
        console.log('currentRouteIndex', this.currentRouteIndex);
        switch (this.currentRouteIndex) {
          case 3:
            if (this.completedStep !== COMPLETESTATUTS.RECIPIENTS) {
              this.SET_STEP_INDEX(0);
              this.$router.push('/Marketing');
            }else {
              if (this.stepIndex !== 3) {
                this.SET_STEP_INDEX(3);
              }
            }
            break;
          case 2:
            console.log(2);
            break;
          case 1:
            if (!this.completedStep && this.completedStep !== 0) {
              this.SET_STEP_INDEX(0);
              this.$router.push('/Marketing');
            }else {
              if (this.stepIndex !== 1) {
                this.SET_STEP_INDEX(1);
              }
            }
            break;
        }
        /*if (this.currentRouteIndex === 3 && this.completedStep !== COMPLETESTATUTS.RECIPIENTS) {
          console.log('_resetPage');
          this.$router.push('/Marketing');
        }*/
      },
      ...mapActions(['resetStore']),
      ...mapMutations(['SET_OPERATE', 'SET_MARKET', 'SET_STEP_INDEX', 'SET_COMPLETED_STEP'])
    },
    created() {
      this.id = Number(localStorage.getItem('marketingId'));
      console.log('localStorage ids :', this.id);

      if (this.id) {
        this.showSpin = true;
        this._getMarketInfo(this.id);
      }else {
        if (this.currentRouteIndex !== 0) {
          this.$router.push('/Marketing');
        }
      }

      // 节流，上下步
      this.go = throttle(800, operate => this.SET_OPERATE(operate));

      // 是否正在reset状态
      this.reseting = false;
    },
    beforeRouteLeave (to, from, next) {
      this.reseting = true;
      removeStroge(['marketingId', 'marketingName', 'isEdit']);
      this.resetStore().then(_ => next());
    }
  }
</script>
<style lang="less" scoped>
  @import "../../assets/styles/variable";
  .slide-left-enter,
  .slide-right-leave-to {
    transform: translateX(100%);
  }
  .slide-right-enter,
  .slide-left-leave-to {
    transform: translateX(-100%);
  }
  .marketing{
    .header{
      /*display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 1250px;*/
      padding: 26px 18px;
      border-top: 1px solid @border-box;
      border-bottom: 1px solid @border-box;
      .title{
        display: block;
        /*max-width: 350px;*/
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: @font-size-lg;
        color: @font-color-normal;
      }
      .steps{
        /*min-width: 608px;*/
        text-align: right;
        ul{
          display: flex;
          align-items: center;
          justify-content: center;
          li{
            color: @font-color-dull-prey;
            font-size: @font-size-lg;
            transition: color .2s;
            margin-right: 30px;
            &.active{
              color: @color-primary;
            }
          }
        }
      }
      .save{
        text-align: right;
        .btn{
          font-size: @font-size-normal;
          &.txt{
            border-top-right-radius: initial;
            border-bottom-right-radius: initial;
          }
          &.arrow{
            border-top-left-radius: initial;
            border-bottom-left-radius: initial;
          }
        }
        .save-item{
          min-width: 180px;
          font-size: @font-size-normal !important;
        }
      }
    }
    .footer {
      position: fixed;
      width: calc(100% - 90px);
      bottom: 0;
      left: 90px;
      padding: 20px;
      background-color: #cddef4;
      /*opacity: .4;*/
      .btns{
        display: flex;
        align-items: center;
        justify-content: space-between;
        /*  .step{
            font-size: @font-size-lg;
            color: @color-white;
            background-color: @bg-btn-green;
          }
          .cancel{
            background-color: @bg-btn-dull-prev;
          }*/
      }
    }
  }
</style>
