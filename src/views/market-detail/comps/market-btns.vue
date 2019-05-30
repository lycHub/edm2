<template>
  <div class="btns">
    <Tooltip v-for="item in btns" :key="item.type" :disabled="item.hideTip" :content="item.type" placement="top" v-show="item.show">
      <Button v-btn-style="item.btnStyle || 'green'" size="large" class="btn" @click="$emit('on-operate', item.type)">
        <template v-if="item.content">
          {{item.content}}
        </template>
        <template v-else>
          <Icon type="ios-refresh" size="22" v-if="item.icon" />
          <Icon custom="i-icon icon-Send-Mail" size="22" v-else />
        </template>
      </Button>
    </Tooltip>

    <!-- 编辑 -->
    <More :showToolTip="false" v-show="currentStatus === 'arranged' || currentStatus === 'draft'">
      <Button v-btn-style="'green'" size="large" class="btn">Edit<Icon type="ios-arrow-down" size="18" class="icon" /></Button>
      <div slot="items">
        <DropdownItem @click.native="$emit('on-edit', 'contents')" style="font-size:14px !important;">Edit contents</DropdownItem>
        <DropdownItem @click.native="$emit('on-edit', 'recipent')" style="font-size:14px !important;">Recipent infomation</DropdownItem>
      </div>
    </More>

    <!-- More -->
    <More :showToolTip="false">
      <Button v-btn-style size="large" class="btn">More<Icon type="ios-arrow-down" size="18" class="icon" /></Button>
      <div slot="items">
        <DropdownItem v-for="item in moreItems" :key="item.type" v-show="item.show" style="font-size:14px !important;" @click.native="$emit('on-operate', item.type)">{{item.type}}</DropdownItem>
      </div>
    </More>
  </div>
</template>

<script>
  import {isEmptyObj, setStroge, toDate} from "../../../utils/tool";
  import {isAfter} from 'date-fns';

  export default {
    name: 'MarketBtns',
    props: {
      hasRc: {
        type: Boolean,
        default: false
      },
      currentStatus: {
        type: String,
        default: ''
      },
      strategy: Object
    },
    data() {
      return {
        showSend: false
      }
    },
    computed: {
      // 是否显示arrange和testMail的按钮
      showTestMailBtn() {
        return this.hasRc && this.currentStatus !== 'sent' && this.currentStatus !== 'deleted';
      },
      arrangeBtn() {
        return this.hasRc && this.currentStatus === 'draft';
      },
      btns() {
//         console.log('hasRc', this.hasRc);
        return [{
          type: 'refresh',
          hideTip: false,
          show: this.currentStatus === 'sending' || this.currentStatus === 'stoped',
          icon: 'ios-refresh'
        }, {
          type: 'testMail',
          hideTip: false,
          show: this.showTestMailBtn,
          custom: 'i-icon icon-Send-Mail',
          btnStyle: 'white'
        }, /*{
          type: 'viewReport',
          hideTip: true,
          show: this.currentStatus === 'sent',
          content: 'View Report'
        }*/ {
          type: 'Arrange',
          hideTip: true,
          show: this.arrangeBtn,
          content: 'Arrange'
        }, {
          type: 'Stop',
          hideTip: true,
          show: this.currentStatus === 'sending',
          content: 'Stop',
          btnStyle: 'red'
        }]
      },
      moreItems() {
        return this.currentStatus === undefined ? [] : [{
          type: 'Copy',
          show: true
        }, {
          type: 'Delete',
          show: this.currentStatus !== 'deleted'
        }, {
          type: 'Move to folder',
          show: this.currentStatus !== 'deleted'
        }];
      }
    }
  }
</script>

<style lang="less" scoped>
 @import "../../../assets/styles/variable";
 .btns{
   .btn{
     margin-right: 10px;
     .icon{
       vertical-align: sub;
       margin-left: 5px;
     }
   }
 }
</style>
